import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {TaskListService} from './task-list.service';
import {LabelService} from './label.service';
import Board from '../models/board';
import {AppConst} from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private readonly dbPath: string = '/boards';
  private boardsRef: AngularFirestoreCollection<Board>;

  constructor(private db: AngularFirestore,
              private taskListService: TaskListService,
              private labelService: LabelService)
  {
    this.boardsRef = db.collection(this.dbPath);
  }

  public getBoards(userId: string): AngularFirestoreCollection<Board> {
    return this.db.collection(this.dbPath, ref => ref
      .where(AppConst.ID, '==', userId)
      .orderBy(AppConst.ORDER, 'asc'));
  }

  public getOtherBoards(userId: string): AngularFirestoreCollection<Board> {
    return this.db.collection(this.dbPath, ref => ref
      .where('usernames', 'array-contains', userId)
      .orderBy(AppConst.ORDER, 'asc'));
  }

  public createBoard(board: Board): Promise<void> {
    const id = this.db.createId();
    const boardRef: AngularFirestoreDocument<any> = this.db.doc(`boards/${id}`);
    return boardRef.set({ ...board, ...{uid: id} }, {
      merge: true
    });
  }

  public updateBoard(id: string, data: any): Promise<void> {
    return this.boardsRef.doc(id).update(data);
  }

  public deleteBoard(id: string): Promise<void> {
    this.taskListService.deleteAllTaskListFromBoard(id);
    this.labelService.deleteAllLabelsFromBoard(id);
    return this.boardsRef.doc(id).delete();
  }

  public getAllBoards(id: string): AngularFirestoreCollection<Board> {
    return this.db.collection(this.dbPath, ref => ref
      .where('uid', '==', id));
  }

}
