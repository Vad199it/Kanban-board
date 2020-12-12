import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import TaskList from '../models/task-list';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private dbPath = '/task-lists';

  taskListRef: AngularFirestoreCollection<TaskList>;

  constructor(private db: AngularFirestore) {
    this.taskListRef = db.collection(this.dbPath);
  }

  getTaskLists(): AngularFirestoreCollection<TaskList> {
    return this.taskListRef;
  }

  createTaskList(taskList: TaskList): any {
    return this.taskListRef.add({ ...taskList });
  }

  updateTaskList(id: string, data: any): Promise<void> {
    return this.taskListRef.doc(id).update(data);
  }

  deleteTaskList(id: string): Promise<void> {
    return this.taskListRef.doc(id).delete();
  }
}
