import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import Board from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private dbPath = '/boards';

  boardsRef: AngularFirestoreCollection<Board>;

  constructor(public db: AngularFirestore) {
    this.boardsRef = db.collection(this.dbPath);
  }

  getBoards(userId: string): AngularFirestoreCollection<Board> {
    return this.db.collection(this.dbPath, ref => ref.where('id', '==', userId));
  }

  createBoard(board: Board): any {
    return this.boardsRef.add({ ...board });
  }

  updateBoard(id: string, data: any): Promise<void> {
    return this.boardsRef.doc(id).update(data);
  }

  deleteBoard(id: string): Promise<void> {
    return this.boardsRef.doc(id).delete();
  }
}
