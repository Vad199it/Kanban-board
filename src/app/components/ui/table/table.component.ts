import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import Board from '../../../models/board';
import { Router } from '@angular/router';
import Label from '../../../models/label';
import {BoardService} from '../../../services/board.service';
import {AuthService} from '../../../services/auth.service';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnDestroy{
  @Input() boards: Board[];
  @Input() tableId: string;
  @Output() currentBoard: EventEmitter<Board> = new EventEmitter();
  @Output() isModal: EventEmitter<boolean> = new EventEmitter();
  @Output() filter: EventEmitter<{array: {active: boolean, filterButtons: boolean}[], tableId: string}> = new EventEmitter();
  public arrayFilterButtons: {active: boolean, filterButtons: boolean}[] =
    [{active: true, filterButtons: true}, {active: false, filterButtons: true}, {active: false, filterButtons: true}];
  public searchingBoards: Board[];
  public title: string;
  public isVisible: boolean = true;
  private subscription = new Subscription();

  constructor(private router: Router,
              private boardService: BoardService,
              private authService: AuthService) { }

  public trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  public navigateToBoard(id: string): void{
    this.router.navigate(['board' , id]);
  }

  public setActiveBoard(board): void {
    this.currentBoard.emit(board);
    this.isModal.emit(!this.isModal);
  }

  public searchResults(text: string): void {
    if (text.length > 2) {
      if (this.tableId === 'myBoards') {
        this.retrieveBoardsBySearch(text);
      }
      else {
        this.retrieveOtherBoardsBySearch(text);
      }
    }
    else{
      this.isVisible = true;
    }
  }

  private retrieveBoardsBySearch(searchText: string): void {
    this.subscription.add(this.boardService.getBoardsBySearch(this.authService.getUser().uid, searchText).valueChanges({idField: 'id'})
      .pipe(
        debounceTime(100)
      )
      .subscribe((data: Board[]) => {
        this.searchingBoards = data;
        this.isVisible = false;

      }));
  }

  private retrieveOtherBoardsBySearch(searchText: string): void {
    this.subscription.add(this.boardService.getOtherBoardsBySearch(this.authService.getUser().uid, searchText).valueChanges({idField: 'id'})
      .pipe(
        debounceTime(100)
      )
      .subscribe((data: Board[]) => {
        this.searchingBoards = data;
        this.isVisible = false;

      }));
  }

  public filterBoards(field: string): void  {
    switch (field){
      case 'icon':
        this.arrayFilterButtons[0].active = true;
        this.arrayFilterButtons[0].filterButtons = !this.arrayFilterButtons[0].filterButtons;
        this.arrayFilterButtons[1].active = false;
        this.arrayFilterButtons[2].active = false;
        break;
      case 'boardName':
        this.arrayFilterButtons[0].active = false;
        this.arrayFilterButtons[1].active = true;
        this.arrayFilterButtons[1].filterButtons = !this.arrayFilterButtons[1].filterButtons;
        this.arrayFilterButtons[2].active = false;
        break;
      case 'ownerName':
        this.arrayFilterButtons[0].active = false;
        this.arrayFilterButtons[1].active = false;
        this.arrayFilterButtons[2].active = true;
        this.arrayFilterButtons[2].filterButtons = !this.arrayFilterButtons[2].filterButtons;
        break;
      default:
        this.arrayFilterButtons[0].active = false;
        this.arrayFilterButtons[1].active = false;
        this.arrayFilterButtons[2].active = false;
        break;
    }
    this.filter.emit({array: this.arrayFilterButtons, tableId: this.tableId});
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
