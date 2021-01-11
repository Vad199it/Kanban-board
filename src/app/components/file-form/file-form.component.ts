import {Component, Input, OnInit} from '@angular/core';
import { FileDataService } from '../../services/file-data.service';
import FileData from '../../models/fileData';

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {
  @Input() taskId: string;
  selectedFiles?: FileList;
  currentFileUpload?: FileData;
  percentage: number = 0;

  constructor(private uploadService: FileDataService) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.percentage = 0;
  }

  upload(): void {
    if (this.selectedFiles) {
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
