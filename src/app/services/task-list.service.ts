import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import TaskList from '../models/task-list';
import {TaskService} from './task.service';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskListService implements OnDestroy {

  private subscription: Subscription;
  private readonly dbPath: string = '/task-lists';
  private taskListRef: AngularFirestoreCollection<TaskList>;

  constructor(private db: AngularFirestore,
              private taskService: TaskService) {
    this.taskListRef = db.collection(this.dbPath);
  }

  public getTaskLists(projectId: string): AngularFirestoreCollection<TaskList> {
    return this.db.collection(this.dbPath, ref => ref
      .where('id', '==', projectId)
      .orderBy('order', 'asc'));
  }

  public getTaskListsById(taskListId: string): AngularFirestoreCollection<TaskList> {
    return this.db.collection(this.dbPath, ref => ref
      .where('uid', '==', taskListId));
  }

  public createTaskList(taskList: TaskList): Promise<void> {
    const id = this.db.createId();
    const taskListRef: AngularFirestoreDocument<any> = this.db.doc(`task-lists/${id}`);
    return taskListRef.set({ ...taskList, ...{uid: id} }, {
      merge: true
    });
  }

  public updateTaskList(id: string, data: any): Promise<void> {
    return this.taskListRef.doc(id).update(data);
  }

  public deleteTaskList(id: string, boardId?: string): Promise<void> {
    this.taskService.deleteAllTaskFromTaskList(id, boardId);
    return this.taskListRef.doc(id).delete();
  }

  public deleteAllTaskListFromBoard(boardId: string): Subscription {
    return this.subscription = this.db.collection(this.dbPath, ref => ref.where('id', '==', boardId))
      .get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.taskService.deleteAllTaskFromTaskList(doc.id);
          doc.ref.delete();
        });
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
