import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';


import {Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';
import FileData from '../models/fileData';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {
  private basePath = '/uploads';

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  public pushFileToStorage(file: File, fileData: FileData, taskId: string): Observable<number | undefined> {
    const id = this.db.createId();
    const filePath = `${this.basePath}/${file.name + id}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileData.url = downloadURL;
          fileData.name = file.name + id;
          this.saveFileData(fileData, taskId);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(fileData: FileData, taskId: string): Promise<void> {
    const id = this.db.createId();
    fileData.taskId = taskId;
    const fileRef: AngularFirestoreDocument<any> = this.db.doc(`uploads/${id}`);
    return fileRef.set({ ...fileData, ...{uid: id} }, {
      merge: true
    });
  }

  public getFiles(taskId: string): AngularFirestoreCollection<FileData> {
    return this.db.collection(this.basePath, ref => ref.where('taskId', '==', taskId));
  }

  public deleteFile(fileData: FileData): void {
    this.deleteFileDatabase(fileData.uid)
      .then(() => {
        this.deleteFileStorage(fileData.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.collection(this.basePath).doc(key).delete();
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }

  public deleteAllFilesFromProject(taskId: string): void{
   this.getFiles(taskId).valueChanges({idField: 'id'}).subscribe((files) => {
     files.forEach(file => {
      this.deleteFile(file);
     });
   });
  }
}
