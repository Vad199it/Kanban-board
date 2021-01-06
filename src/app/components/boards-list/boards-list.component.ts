import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import Board from '../../models/board';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss']
})
export class BoardsListComponent implements OnInit, OnDestroy {
  boards: Board[];
  otherBoards: Board[];
  currentBoard = null;
  // currentIndex = -1;
  title = '';
  subscription: Subscription;
  tittle: string;
  tittleOther: string;
  isModal: boolean = false;

  constructor(private boardService: BoardService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.retrieveBoards();
    this.retrieveOtherBoards();
  }

  refreshList(): void {
    this.currentBoard = null;
    // this.currentIndex = -1;
    this.retrieveBoards();
  }

  retrieveOtherBoards(): void {
    this.subscription = this.boardService.getOtherBoards(this.authService.getUser().uid).valueChanges({idField: 'id'})
      .subscribe((data: Board[]) => {
        this.otherBoards = data;
      });
  }

  retrieveBoards(): void {
    this.subscription = this.boardService.getBoards(this.authService.getUser().uid).valueChanges({idField: 'id'})
      .subscribe((data: Board[]) => {
      this.boards = data;
    });
  }

  setActiveBoard(board): void {
    this.currentBoard = board;
    // this.currentIndex = index;
    this.isModal = !this.isModal;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchInBoards(): void { // ??????
    if (this.tittle !== ''){
      this.boards = this.boards.filter(res => {
        return res.title.toLowerCase().match(this.tittle.toLowerCase());
      });
    }
    else if (this.tittle === ''){
      this.retrieveBoards();
    }
  }

  searchInOtherBoards(): void { // ??????
    if (this.tittleOther !== ''){
      this.otherBoards = this.boards.filter(res => {
        return res.title.toLowerCase().match(this.tittleOther.toLowerCase());
      });
    }
    else if (this.tittleOther === ''){
      this.retrieveOtherBoards();
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
