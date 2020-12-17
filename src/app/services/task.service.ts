import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import Task from '../models/task';
import {Subscription} from 'rxjs';
import {AppConst} from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {

  private subscription: Subscription;
  private dbPath = '/tasks';
  private taskRef: AngularFirestoreCollection<Task>;

  constructor(private db: AngularFirestore) {
    this.taskRef = db.collection(this.dbPath);
  }

  public getTasks(taskId: string): AngularFirestoreCollection<Task> {
    return this.db.collection(this.dbPath, ref => ref.where(AppConst.ID, '==', taskId));
  }

  public createTask(task: Task): Promise<void> {
    const id = this.db.createId();
    const taskRef: AngularFirestoreDocument<any> = this.db.doc(`tasks/${id}`);
    return taskRef.set({ ...task, ...{uid: id} }, {
      merge: true
    });
  }

  public updateTask(id: string, data: any): Promise<void> {
    return this.taskRef.doc(id).update(data);
  }

  public deleteTask(id: string): Promise<void> {
    return this.taskRef.doc(id).delete();
  }

  public deleteAllTaskFromTaskList(taskListId: string): Subscription{
    return this.subscription = this.db.collection(this.dbPath, ref => ref.where(AppConst.ID, '==', taskListId))
      .get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
