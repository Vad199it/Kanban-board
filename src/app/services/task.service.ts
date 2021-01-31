import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import Task from '../models/task';
import {Subscription} from 'rxjs';
import {AppConst} from '../app.constants';
import {FileDataService} from './file-data.service';
import Board from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {

  private readonly dbPath: string = '/tasks';
  private readonly dbPathBoard: string = '/boards';
  private taskRef: AngularFirestoreCollection<Task>;
  public board: Board[];
  private subscription: Subscription = new Subscription();

  constructor(private db: AngularFirestore,
              private fileDataService: FileDataService) {
    this.taskRef = db.collection(this.dbPath);
  }

  public getTasks(taskId: string): AngularFirestoreCollection<Task> {
    return this.db.collection(this.dbPath, ref => ref.where(AppConst.ID, '==', taskId));
  }

  public getTaskById(taskId: string): AngularFirestoreCollection<Task> {
    return this.db.collection(this.dbPath, ref => ref.where('uid', '==', taskId));
  }

  public getTasksFromTaskList(tasksId: string[]): AngularFirestoreCollection<Task> {
    return this.db.collection(this.dbPath, ref => ref.where('uid', 'in', tasksId));
  }

  public createTask(task: Task, id: string): Promise<void> {
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
    if (boardId) {
      this.subscription.add(this.db.collection(this.dbPathBoard, ref => ref
        .where('uid', '==', boardId)).valueChanges({idField: 'uid'})
        .subscribe((data: Board[]) => {
          this.board = data;
        }));
    }

    return this.subscription.add(this.db.collection(this.dbPath, ref => ref.where(AppConst.ID, '==', taskListId))
      .get().subscribe((querySnapshot) => {
        let set: string[];
        if (boardId) {
          set = this.board[0].usernames;
        }
        querySnapshot.forEach((doc) => {
          this.fileDataService.deleteAllFilesFromProject(doc.id);
          if (boardId) {
          set = this.removeFirst(set, doc.get('doTask'));
          const boardData = {
            usernames: [...set],
          };
          this.db.collection(this.dbPathBoard).doc(boardId).update(boardData).catch(err => console.log(err));
          }
          doc.ref.delete();
        });
      }));
  }

  removeFirst(src: string[], element: string): string[] {
    const index = src.indexOf(element);
    if (index === -1) { return src; }
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
