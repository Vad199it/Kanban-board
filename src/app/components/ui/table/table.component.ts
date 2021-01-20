import {Component, EventEmitter, Input, Output} from '@angular/core';
import Board from '../../../models/board';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() boards: Board[];
  @Input() tableId: string;
  @Output() currentBoard: EventEmitter<Board> = new EventEmitter();
  @Output() isModal: EventEmitter<boolean> = new EventEmitter();
  @Output() filter: EventEmitter<{array: {active: boolean, filterButtons: boolean}[], tableId: string}> = new EventEmitter();
  public arrayFilterButtons: {active: boolean, filterButtons: boolean}[] =
    [{active: true, filterButtons: true}, {active: false, filterButtons: true}, {active: false, filterButtons: true}];
  public title: string;

  constructor(private router: Router) { }

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

}
