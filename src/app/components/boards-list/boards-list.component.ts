import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {BoardService} from '../../services/board.service';
import {AuthService} from '../../services/auth.service';
import Board from '../../models/board';
import firebase from 'firebase';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss']
})
export class BoardsListComponent implements OnInit, OnDestroy {
  public boards: Board[];
  public otherBoards: Board[];
  public currentBoard: Board;
  public firstInResponse: any = [];
  public lastInResponse: any = [];
  public prevStrAt: any[] = [];
  public firstInResponseOther: any = [];
  public lastInResponseOther: any = [];
  public prevStrAtOther: any[] = [];
  public disableNext: boolean = false;
  public disablePrev: boolean = false;
  public disableNextOther: boolean = false;
  public disablePrevOther: boolean = false;
  public paginationClickedCount: number = 0;
  public paginationClickedCountOther: number = 0;
  public isModal: boolean = false;
  public field: string;
  public fieldOther: string;
  public directionStr: 'asc' | 'desc';
  public directionStrOther: 'asc' | 'desc';
  private subscription: Subscription = new Subscription();

  constructor(private boardService: BoardService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.retrieveBoards();
    this.retrieveOtherBoards();
  }

  public refreshList(): void {
    this.currentBoard = null;
    this.retrieveBoards();
  }

  private retrieveOtherBoards(field?: string, directionStr?: 'asc' | 'desc'): void {
    this.fieldOther = field;
    this.directionStrOther = directionStr;
    this.subscription.add(this.boardService.getOtherBoards(this.authService.getUser().uid, field, directionStr)
      .get()
      .subscribe((response) => {
        this.firstInResponseOther = response.docs[0];
        this.lastInResponseOther = response.docs[response.docs.length - 1];
        this.subscription.add(this.boardService.getOtherBoards(this.authService.getUser().uid, field, directionStr)
          .valueChanges({idField: 'id'})
          .subscribe((data: Board[]) => {
            if (!data.length) {
              return false;
            }
            this.otherBoards = data;
            this.prevStrAtOther = [];
            this.paginationClickedCountOther = 0;
            this.disableNextOther = true;
            this.disablePrevOther = false;
            this.disableNextOther = !(data.length < 11);
            this.pushPrevStartAt(this.firstInResponseOther, this.prevStrAtOther);
          }));
      }));
  }

  public pushPrevStartAt(prevFirstDoc: any, prevStrAt: any[]): void {
    let isExist: boolean = false;
    prevStrAt.forEach((element, index: number) => {
      if (prevFirstDoc.data().uid === element.data().uid) {
        isExist = true;
      }
    });
    if (!isExist) {
      prevStrAt.push(prevFirstDoc);
    }
  }

  public popPrevStartAt(prevFirstDoc: any, prevStrAt: any[]): void {
    prevStrAt.pop();
  }

  public getPrevStartAt(prevStrAt: any[], paginationClickedCount: number): any {
    return prevStrAt[paginationClickedCount];
  }

  private retrieveBoards(field?: string, directionStr?: 'asc' | 'desc'): void {
    this.field = field;
    this.directionStr = directionStr;
    this.subscription.add(this.boardService.getBoards(this.authService.getUser().uid, field, directionStr)
      .get()
      .subscribe((response) => {
        this.subscription.add(this.boardService.getBoards(this.authService.getUser().uid, field, directionStr)
          .valueChanges({idField: 'id'})
          .subscribe((data: Board[]) => {
            if (!data.length) {
              return false;
            }
            this.firstInResponse = response.docs[0];
            this.lastInResponse = response.docs[response.docs.length - 1];
            this.boards = data;
            this.prevStrAt = [];
            this.paginationClickedCount = 0;
            this.disablePrev = false;
            this.disableNext = !(data.length < 11);
            this.pushPrevStartAt(this.firstInResponse, this.prevStrAt);
          }));
      }));
  }

  public nextPage(): void {
    ++this.paginationClickedCount;
    this.disableNext = true;
    this.subscription.add(this.boardService.getNextPageOfBoards(this.authService.getUser().uid, this.field,
      this.directionStr, this.lastInResponse)
      .get()
      .subscribe((response) => {
        this.subscription.add(this.boardService.getNextPageOfBoards(this.authService.getUser().uid, this.field,
          this.directionStr, this.lastInResponse)
          .valueChanges({idField: 'id'})
          .subscribe((data: Board[]) => {
            this.firstInResponse = response.docs[0];
            this.lastInResponse = response.docs[response.docs.length - 1];
            this.boards = data;
            this.pushPrevStartAt(this.firstInResponse, this.prevStrAt);
            this.disableNext = !(data.length < 11);
            this.disablePrev = true;
          }, error => {
            this.disableNext = true;
          }));
      }));
  }

  public nextPageOther(): void {
    ++this.paginationClickedCountOther;
    this.disableNextOther = true;
    this.subscription.add(this.boardService.getNextPageOfOtherBoards(this.authService.getUser().uid, this.fieldOther,
      this.directionStrOther, this.lastInResponseOther)
      .get()
      .subscribe((response) => {
        this.subscription.add(this.boardService.getNextPageOfOtherBoards(this.authService.getUser().uid, this.fieldOther,
          this.directionStrOther, this.lastInResponseOther)
          .valueChanges({idField: 'id'})
          .subscribe((data: Board[]) => {
            this.firstInResponseOther = response.docs[0];
            this.lastInResponseOther = response.docs[response.docs.length - 1];
            this.otherBoards = data;
            this.pushPrevStartAt(this.firstInResponseOther, this.prevStrAtOther);
            this.disableNextOther = !(data.length < 11);
            this.disablePrevOther = true;
          }, error => {
            this.disableNextOther = true;
          }));
      }));
  }

  public prevPage(): void {
    --this.paginationClickedCount;
    const prevStartAt: any = this.getPrevStartAt(this.prevStrAt, this.paginationClickedCount);
    this.subscription.add(this.boardService.getPrevPageOfBoards(this.authService.getUser().uid, this.field,
      this.directionStr, this.firstInResponse, prevStartAt)
      .get()
      .subscribe((response) => {
        this.boardService.getPrevPageOfBoards(this.authService.getUser().uid, this.field,
          this.directionStr, this.firstInResponse, prevStartAt)
          .valueChanges({idField: 'id'})
          .pipe(
            take(1)
          )
          .subscribe((data: Board[]) => {
            this.disablePrev = true;
            this.firstInResponse = response.docs[0];
            this.lastInResponse = response.docs[response.docs.length - 1];
            this.boards = data;
            this.popPrevStartAt(this.firstInResponse, this.prevStrAt);
            this.disablePrev = !(this.paginationClickedCount === 0);
            this.disableNext = true;
          }, error => {
            this.disablePrev = true;
          });
      }));
  }

  public prevPageOther(): void {
    const prevStartAtOther: any = this.getPrevStartAt(this.prevStrAtOther, this.paginationClickedCountOther);
    --this.paginationClickedCountOther;
    this.subscription.add(this.boardService.getPrevPageOfOtherBoards(this.authService.getUser().uid, this.fieldOther,
      this.directionStrOther, this.firstInResponseOther, prevStartAtOther)
      .get()
      .subscribe((response) => {
        this.boardService.getPrevPageOfOtherBoards(this.authService.getUser().uid, this.fieldOther,
          this.directionStrOther, this.firstInResponseOther, prevStartAtOther)
          .valueChanges({idField: 'id'})
          .pipe(
            take(1)
          )
          .subscribe((data: Board[]) => {
            this.disablePrevOther = true;
            this.firstInResponseOther = response.docs[0];
            this.lastInResponseOther = response.docs[response.docs.length - 1];
            this.otherBoards = data;
            this.popPrevStartAt(this.firstInResponseOther, this.prevStrAtOther);
            this.disablePrevOther = !(this.paginationClickedCountOther === 0);
            this.disableNextOther = true;
          }, error => {
            this.disablePrevOther = true;
          });
      }));
  }

  public setActiveBoard(board: Board): void {
    this.currentBoard = board;
    this.isModal = !this.isModal;
  }

  public closeModal(value: boolean): void {
    this.isModal = !value;
  }

  public retrieveBoardsByFilter(value: { array: { active: boolean, filterButtons: boolean }[], tableId: string }): void {
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
