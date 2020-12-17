import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import Label from '../models/label';
import {Subscription} from 'rxjs';
import {AppConst} from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class LabelService  implements OnDestroy {

  private dbPath = '/labels';
  private subscription: Subscription;
  private labelsRef: AngularFirestoreCollection<Label>;

  constructor(private db: AngularFirestore) {
    this.labelsRef = db.collection(this.dbPath);
  }

  public getLabelsFromProject(projectId: string): AngularFirestoreCollection<Label> {
    return this.db.collection(this.dbPath, ref => ref
      .where(AppConst.PROJECTID, '==', projectId)
      .orderBy(AppConst.ORDER, 'asc'));
  }

  public getLabelsFromTask(taskId: string, projectId: string): AngularFirestoreCollection<Label> {
    return this.db.collection(this.dbPath, ref =>
      ref.where(AppConst.PROJECTID, '==', projectId)
        .where(AppConst.TASKID, 'array-contains', taskId)
        .orderBy(AppConst.ORDER, 'asc')
    );
  }

  public createLabel(label: Label): Promise<void> {
    const id = this.db.createId();
    const labelRef: AngularFirestoreDocument<any> = this.db.doc(`labels/${id}`);
    return labelRef.set({ ...label, ...{uid: id} }, {
      merge: true
    });
  }

  public updateLabel(id: string, data: any): Promise<void> {
    return this.labelsRef.doc(id).update(data);
  }

  public deleteLabelFromBoard(id: string): Promise<void> {
    return this.labelsRef.doc(id).delete();
  }

  public deleteAllLabelsFromBoard(projectId: string): Subscription{
    return this.subscription = this.db.collection(this.dbPath, ref => ref.where(AppConst.PROJECTID, '==', projectId))
      .get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
