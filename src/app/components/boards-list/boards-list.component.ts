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

  private retrieveOtherBoards(field?: string, directionStr?: 'asc' | 'desc'): void {
    this.subscription.add(this.boardService.getOtherBoards(this.authService.getUser().uid, field, directionStr)
      .valueChanges({idField: 'id'})
      .subscribe((data: Board[]) => {
        this.otherBoards = data;
      }));
  }

  private retrieveBoards(field?: string, directionStr?: 'asc' | 'desc'): void {
    this.subscription.add(this.boardService.getBoards(this.authService.getUser().uid, field, directionStr)
      .valueChanges({idField: 'id'})
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

  public retrieveBoardsByFilter(value: {array: {active: boolean, filterButtons: boolean}[], tableId: string}): void {
    if (value.tableId === 'myBoards') {
      if (value.array[0].active) {
        if (value.array[0].filterButtons) {
          this.retrieveBoards('order', 'asc');
        } else {
          this.retrieveBoards('order', 'desc');
        }
      } else if (value.array[1].active) {
        if (value.array[1].filterButtons) {
          this.retrieveBoards('title', 'asc');
        } else {
          this.retrieveBoards('title', 'desc');
        }
      } else if (value.array[2].active) {
        if (value.array[2].filterButtons) {
          this.retrieveBoards('ownerUsername', 'asc');
        } else {
          this.retrieveBoards('ownerUsername', 'desc');
        }
      }
    } else {
      if (value.array[0].active) {
        if (value.array[0].filterButtons) {
          this.retrieveOtherBoards('order', 'asc');
        } else {
          this.retrieveOtherBoards('order', 'desc');
        }
      } else if (value.array[1].active) {
        if (value.array[1].filterButtons) {
          this.retrieveOtherBoards('title', 'asc');
        } else {
          this.retrieveOtherBoards('title', 'desc');
        }
      } else if (value.array[2].active) {
        if (value.array[2].filterButtons) {
          this.retrieveOtherBoards('ownerUsername', 'asc');
        } else {
          this.retrieveOtherBoards('ownerUsername', 'desc');
        }
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
