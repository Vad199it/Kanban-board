import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import Board from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private dbPath = '/boards';

  tutorialsRef: AngularFirestoreCollection<Board>;

  constructor(private db: AngularFirestore) {
    this.tutorialsRef = db.collection(this.dbPath);
  }

  getBoards(): AngularFirestoreCollection<Board> {
    return this.tutorialsRef;
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
