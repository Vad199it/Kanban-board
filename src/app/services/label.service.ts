import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';

import Label from '../models/label';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService  implements OnDestroy {

  private dbPath = '/labels';
  subscription: Subscription;

  labelsRef: AngularFirestoreCollection<Label>;

  constructor(private db: AngularFirestore) {
    this.labelsRef = db.collection(this.dbPath);
  }

  public getLabelsFromProject(projectId: string): AngularFirestoreCollection<Label> {
    return this.db.collection(this.dbPath, ref => ref.where('projectId', '==', projectId));
  }

  public getLabelsFromTask(taskId: string, projectId: string): AngularFirestoreCollection<Label> {
    return this.db.collection(this.dbPath, ref =>
      ref.where('projectId', '==', projectId).where('taskId', 'array-contains', taskId)
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

  public deleteAllLabelsFromBoard(projectId: string): any{
    return this.subscription = this.db.collection(this.dbPath, ref => ref.where('projectId', '==', projectId))
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
