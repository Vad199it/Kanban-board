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
  taskLabels: Label[];
  currentLabel = null;
  title = '';
  subscription: Subscription;
  subscription1: Subscription;
  tittle: string;
  isModal: boolean = false;

  constructor(private labelService: LabelService) { }

  ngOnInit(): void {
    this.retrieveTaskLabels();
    this.retrieveLabels();
  }

  refreshList(): void {
    this.currentLabel = null;
    this.retrieveLabels();
  }

  retrieveLabels(): void {
    this.subscription = this.labelService.getLabelsFromProject(this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.labels = data;
      });
  }

  retrieveTaskLabels(): void {
    this.subscription1 = this.labelService.getLabelsFromTask(this.taskId, this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.taskLabels = data;
      });
  }

  setActiveLabel(label): void {
    this.currentLabel = label;
    this.isModal = !this.isModal;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  closeModal(value: boolean): void {
    this.isModal = !value;
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  choseLabel(label): void{
    this.currentLabel = label;
    const set = new Set(this.currentLabel.taskId);
    if (set.has(this.taskId)){
      set.delete(this.taskId);
    }
    else{
      set.add(this.taskId);
    }
    const labelData = {
      taskId: [...set],
    };
    this.labelService.updateLabel(this.currentLabel.uid, labelData)
      .catch(err => console.log(err));
  }

  labelIncludeInTaskLabel(label: Label): boolean {
    let isEqual: boolean = false;
    this.taskLabels.forEach((taskLabel: Label): void => {
      if (taskLabel.uid === label.uid){
        isEqual = true;
      }
    });
    return isEqual;
  }
}
