import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { FileDataService } from '../../services/file-data.service';
import FileData from '../../models/fileData';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() taskId: string;
  fileUploads?: FileData[];
  subscription: Subscription;

  constructor(private uploadService: FileDataService) { }

  ngOnInit(): void {
    // this.retrieveBoards();
  }

  ngOnChanges(): void {
    this.retrieveBoards();
  }

  retrieveBoards(): void {
    this.subscription = this.uploadService.getFiles(this.taskId).valueChanges({idField: 'uid'})
      .subscribe((data: FileData[]) => {
        this.fileUploads = data;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
