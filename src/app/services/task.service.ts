import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import Task from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private dbPath = '/tasks';

  tutorialsRef: AngularFirestoreCollection<Task>;

  constructor(private db: AngularFirestore) {
    this.tutorialsRef = db.collection(this.dbPath);
  }

  getTasks(): AngularFirestoreCollection<Task> {
    return this.tutorialsRef;
  }

  createTask(task: Task): any {
    return this.tutorialsRef.add({ ...task });
  }

  updateTask(id: string, data: any): Promise<void> {
    return this.tutorialsRef.doc(id).update(data);
  }

  deleteTask(id: string): Promise<void> {
    return this.tutorialsRef.doc(id).delete();
  }
}
