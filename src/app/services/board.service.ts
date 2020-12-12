import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import Board from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private dbPath = '/boards';

  tutorialsRef: AngularFirestoreCollection<Board>;

  constructor(public db: AngularFirestore) {
    this.tutorialsRef = db.collection(this.dbPath);
  }

  getBoards(userId: string): AngularFirestoreCollection<Board> {
    return this.db.collection(this.dbPath, ref => ref.where('id', '==', userId));
  }

  createBoard(board: Board): any {
    return this.tutorialsRef.add({ ...board });
  }

  updateBoard(id: string, data: any): Promise<void> {
    return this.tutorialsRef.doc(id).update(data);
  }

  deleteBoard(id: string): Promise<void> {
    return this.tutorialsRef.doc(id).delete();
  }
}
