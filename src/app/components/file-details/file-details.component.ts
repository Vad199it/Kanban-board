import {Component, Input} from '@angular/core';

import { FileDataService } from '../../services/file-data.service';
import FileData from '../../models/fileData';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent {
  @Input() fileUpload!: FileData;

  constructor(private uploadService: FileDataService) { }

  public deleteFileUpload(fileData: FileData): void {
    this.uploadService.deleteFile(fileData);
  }

  public correctFileName(fileName: string): string{
    return fileName.split('.')[0] + '.' + fileName.split('.')[1].substr(0, 3);
  }

}
