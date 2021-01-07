import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {LabelService} from '../../services/label.service';
import Label from '../../models/label';

@Component({
  selector: 'app-label-list-project',
  templateUrl: './label-list-project.component.html',
  styleUrls: ['./label-list-project.component.scss']
})
export class LabelListProjectComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  @Input() taskId: string;
  labels: Label[];
  currentLabel = null;
  // currentIndex = -1;
  title = '';
  subscription: Subscription;
  tittle: string;
  isModal: boolean = false;

  constructor(private labelService: LabelService) { }

  ngOnInit(): void {
    this.retrieveLabels();
  }

  refreshList(): void {
    this.currentLabel = null;
    // this.currentIndex = -1;
    this.retrieveLabels();
  }

  retrieveLabels(): void {
    this.subscription = this.labelService.getLabelsFromProject(this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.labels = data;
      });
  }

  setActiveLabel(label): void {
    this.currentLabel = label;
    // this.currentIndex = index;
    this.isModal = !this.isModal;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(): void {
    if (this.tittle !== ''){
      this.labels = this.labels.filter(res => {
        return res.title.toLowerCase().match(this.tittle.toLowerCase());
      });
    }
    else if (this.tittle === ''){
      this.retrieveLabels();
    }
  }

  closeModal(value: boolean): void {
    this.isModal = !value;
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  choseLabel(label, index): void{
    this.currentLabel = label;
    const set = new Set(this.currentLabel.taskId);
    set.add(this.taskId);
    const labelData = {
      taskId: [...set],
    };
    this.labelService.updateLabel(this.currentLabel.uid, labelData)
      .catch(err => console.log(err));
  }
}
