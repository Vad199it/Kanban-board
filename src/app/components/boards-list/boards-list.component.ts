import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.css']
})
export class BoardsListComponent implements OnInit, OnDestroy {
  boards: any;
  currentBoard = null;
  currentIndex = -1;
  title = '';
  subscription: Subscription;
  tittle: string;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.retrieveBoards();
  }

  refreshList(): void {
    this.currentBoard = null;
    this.currentIndex = -1;
    this.retrieveBoards();
  }

  retrieveBoards(): void {
    this.subscription = this.boardService.getBoards().valueChanges({idField: 'id'})
      .subscribe(data => {
      this.boards = data;
    });
  }

  setActiveBoard(board, index): void {
    this.currentBoard = board;
    this.currentIndex = index;
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
      this.retrieveBoards();
    }
  }

}
