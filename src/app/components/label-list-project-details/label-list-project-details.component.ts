import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import Label from '../../models/label';
import {LabelService} from '../../services/label.service';

@Component({
  selector: 'app-label-list-project-details',
  templateUrl: './label-list-project-details.component.html',
  styleUrls: ['./label-list-project-details.component.scss']
})
export class LabelListProjectDetailsComponent implements OnInit, OnChanges {
  @Input() label: Label;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentLabel: Label = null;
  message: string = '';
  constructor(private labelService: LabelService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentLabel = { ...this.label };
  }

  updateLabel(): void {
    const data = {
      title: this.currentLabel.title,
      color: this.currentLabel.color || 'black',
    };
    this.labelService.updateLabel(this.currentLabel.uid, data)
      .then(() => {
        this.isModal.emit(true);
      })
      .catch(err => console.log(err));
  }

  deleteLabel(): void {
    this.isModal.emit(true);
    this.labelService.deleteLabelFromBoard(this.currentLabel.uid)
      .then(() => {
        this.refreshList.emit();
        this.message = 'The board was updated successfully!';
      })
      .catch(err => console.log(err));
  }

}
