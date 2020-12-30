import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import Task from '../models/task';
import {Subscription} from 'rxjs';
import {AppConst} from '../app.constants';
import {FileDataService} from '../services/file-data.service';
import Board from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {

  private subscription: Subscription;
  private subscription1: Subscription;
  private dbPath = '/tasks';
  private dbPathBoard = '/boards';
  private taskRef: AngularFirestoreCollection<Task>;
  private board: Board[];

  constructor(private db: AngularFirestore,
              private fileDataService: FileDataService) {
    this.taskRef = db.collection(this.dbPath);
  }


  public getTasks(taskId: string): AngularFirestoreCollection<Task> {
    return this.db.collection(this.dbPath, ref => ref.where(AppConst.ID, '==', taskId));
  }

  public createTask(task: Task, id: string): Promise<void> {
    // const id = this.db.createId();
    const taskRef: AngularFirestoreDocument<any> = this.db.doc(`tasks/${id}`);
    return taskRef.set({... task}, {
      merge: true
    });
  }

  public updateTask(id: string, data: any): Promise<void> {
    return this.taskRef.doc(id).update(data);
  }

  public deleteTask(id: string): Promise<void> {
    this.fileDataService.deleteAllFilesFromProject(id);
    return this.taskRef.doc(id).delete();
  }

  public deleteAllTaskFromTaskList(taskListId: string, boardId?: string): Subscription{
    this.subscription1 = this.db.collection(this.dbPathBoard, ref => ref
      .where('uid', '==', boardId)).valueChanges({idField: 'uid'})
      .subscribe((data: Board[]) => {
        this.board = data;
      });

    return this.subscription = this.db.collection(this.dbPath, ref => ref.where(AppConst.ID, '==', taskListId))
      .get().subscribe((querySnapshot) => {
        let set: string[] = this.board[0].usernames;
        querySnapshot.forEach((doc) => {
          this.fileDataService.deleteAllFilesFromProject(doc.id);
          console.log(set);
          console.log(doc.get('doTask'));
          set = this.removeFirst(set, doc.get('doTask'));
          const boardData = {
            usernames: [...set],
          };
          this.db.collection(this.dbPathBoard).doc(boardId).update(boardData).catch(err => console.log(err));
          doc.ref.delete();
        });
      });
  }

  removeFirst(src: string[], element: string): string[] {
    const index = src.indexOf(element);
    if (index === -1) { return src; }
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }
}
