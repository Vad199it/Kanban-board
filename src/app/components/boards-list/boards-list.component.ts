import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss']
})
export class BoardsListComponent implements OnInit, OnDestroy {
  boards: any;
  currentBoard = null;
  currentIndex = -1;
  title = '';
  subscription: Subscription;
  tittle: string;
  isModal: boolean = false;

  constructor(private boardService: BoardService,
              public authService: AuthService,
              public router: Router) { }

  ngOnInit(): void {
    this.retrieveBoards();
  }

  refreshList(): void {
    this.currentBoard = null;
    this.currentIndex = -1;
    this.retrieveBoards();
  }

  retrieveBoards(): void {
    this.subscription = this.boardService.getBoards(this.authService.getUser().uid).valueChanges({idField: 'id'})
      .subscribe(data => {
      this.boards = data;
    });
  }

  setActiveBoard(board, index): void {
    this.currentBoard = board;
    this.currentIndex = index;
    this.isModal = !this.isModal;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(): void { // ??????
    if (this.tittle !== ''){
      this.boards = this.boards.filter(res => {
        return res.title.toLowerCase().match(this.tittle.toLowerCase());
      });
    }
    else if (this.tittle === ''){
      this.ngOnInit();
    }
  }

  closeModal(value: boolean): void {
    this.isModal = !value;
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  navigateToBoard(id: string): void{
    this.router.navigate(['board' , id]);
  }

}
