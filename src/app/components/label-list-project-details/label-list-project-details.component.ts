import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

import Label from '../../models/label';
import {LabelService} from '../../services/label.service';

@Component({
  selector: 'app-label-list-project-details',
  templateUrl: './label-list-project-details.component.html',
  styleUrls: ['./label-list-project-details.component.scss']
})
export class LabelListProjectDetailsComponent implements OnChanges {
  @Input() label: Label;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  public currentLabel: Label = null;

  constructor(private labelService: LabelService) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.label && changes.label.currentValue) {
      this.currentLabel = {...this.label};
    }
  }

  public updateLabel(): void {
    const data: {title: string, color: string} = {
      title: this.currentLabel.title,
      color: this.currentLabel.color || 'black',
    };
    this.labelService.updateLabel(this.currentLabel.uid, data)
      .then(() => {
        this.isModal.emit(true);
      })
      .catch(err => console.log(err));
  }

  public deleteLabel(): void {
    this.isModal.emit(true);
    this.labelService.deleteLabelFromBoard(this.currentLabel.uid)
      .then(() => {
        this.refreshList.emit();
      })
      .catch(err => console.log(err));
  }

}
