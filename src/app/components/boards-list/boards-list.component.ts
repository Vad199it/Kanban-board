import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import Board from '../../models/board';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss']
})
export class BoardsListComponent implements OnInit, OnDestroy {
  public boards: Board[];
  public otherBoards: Board[];
  public currentBoard: Board;
  public isModal: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private boardService: BoardService,
              private authService: AuthService) { }

  public ngOnInit(): void {
    this.retrieveBoards();
    this.retrieveOtherBoards();
  }

  public refreshList(): void {
    this.currentBoard = null;
    this.retrieveBoards();
  }

  private retrieveOtherBoards(): void {
    this.subscription.add(this.boardService.getOtherBoards(this.authService.getUser().uid).valueChanges({idField: 'id'})
      .subscribe((data: Board[]) => {
        this.otherBoards = data;
      }));
  }

  private retrieveBoards(): void {
    this.subscription.add(this.boardService.getBoards(this.authService.getUser().uid).valueChanges({idField: 'id'})
      .subscribe((data: Board[]) => {
      this.boards = data;
    }));
  }

  public setActiveBoard(board: Board): void {
    this.currentBoard = board;
    this.isModal = !this.isModal;
  }

  public closeModal(value: boolean): void {
    this.isModal = !value;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
