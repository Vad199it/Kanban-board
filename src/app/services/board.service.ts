import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';

import {TaskListService} from './task-list.service';
import Board from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private dbPath = '/boards';

  boardsRef: AngularFirestoreCollection<Board>;

  constructor(private db: AngularFirestore,
              private taskListService: TaskListService) {
    this.boardsRef = db.collection(this.dbPath);
  }

  public getBoards(userId: string): AngularFirestoreCollection<Board> {
    return this.db.collection(this.dbPath, ref => ref.where('id', '==', userId));
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
    return this.boardsRef.doc(id).delete();
  }

}
