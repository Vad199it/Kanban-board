import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import { FileDataService } from '../../services/file-data.service';
import FileData from '../../models/fileData';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnDestroy, OnChanges {
  @Input() taskId: string;
  public fileUploads?: FileData[];
  private subscription: Subscription;

  constructor(private uploadService: FileDataService) { }

  public ngOnChanges(): void {
    this.retrieveBoards();
  }

  private retrieveBoards(): void {
    this.subscription = this.uploadService.getFiles(this.taskId).valueChanges({idField: 'uid'})
      .subscribe((data: FileData[]) => {
        this.fileUploads = data;
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
