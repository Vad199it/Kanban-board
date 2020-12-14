import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';

import TaskList from '../models/task-list';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private dbPath = '/task-lists';

  taskListRef: AngularFirestoreCollection<TaskList>;

  constructor(private db: AngularFirestore) {
    this.taskListRef = db.collection(this.dbPath);
  }

  getTaskLists(taskListId: string): AngularFirestoreCollection<TaskList> {
    return this.db.collection(this.dbPath, ref => ref.where('id', '==', taskListId));
  }

  createTaskList(taskList: TaskList): Promise<void> {
    const id = this.db.createId();
    const taskListRef: AngularFirestoreDocument<any> = this.db.doc(`task-lists/${id}`);
    return taskListRef.set({ ...taskList, ...{uid: id} }, {
      merge: true
    });
  }

  updateTaskList(id: string, data: any): Promise<void> {
    return this.taskListRef.doc(id).update(data);
  }

  deleteTaskList(id: string): Promise<void> {
    return this.taskListRef.doc(id).delete();
  }

  deleteAllTaskListFromBoard(boardId: string): any{
    return this.db.collection(this.dbPath, ref => ref.where('id', '==', boardId))
      .get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }
}
