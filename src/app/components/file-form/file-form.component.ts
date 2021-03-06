import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import { FileDataService } from '../../services/file-data.service';
import FileData from '../../models/fileData';

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnChanges{
  @Input() taskId: string;
  public selectedFiles?: FileList;
  public currentFileUpload?: FileData;
  public percentage: number = 0;
  public isBigSize: boolean;

  constructor(private uploadService: FileDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskId && changes.taskId.currentValue) {
      this.percentage = 0;
      this.selectedFiles = null;
      this.isBigSize = false;
    }
  }

  public selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.percentage = 0;
    this.isBigSize = this.selectedFiles.item(0).size > 10485760;
  }

  public disableButton(): boolean{
    return !this.selectedFiles || this.isBigSize;
  }

  public upload(): void {
    if (this.selectedFiles && !this.isBigSize) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileData();
        this.uploadService.pushFileToStorage(file, this.currentFileUpload, this.taskId).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }

  }
}
