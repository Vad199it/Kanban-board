import {Component, Input, OnInit} from '@angular/core';
import { FileDataService } from '../../services/file-data.service';
import FileData from '../../models/fileData';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  @Input() fileUpload!: FileData;
  constructor(private uploadService: FileDataService) { }

  ngOnInit(): void {
  }

  deleteFileUpload(fileData: FileData): void {
    this.uploadService.deleteFile(fileData);
  }

}
