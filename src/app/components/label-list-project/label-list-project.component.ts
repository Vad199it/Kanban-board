import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {from, Subscription} from 'rxjs';

import {LabelService} from '../../services/label.service';
import Label from '../../models/label';

@Component({
  selector: 'app-label-list-project',
  templateUrl: './label-list-project.component.html',
  styleUrls: ['./label-list-project.component.scss']
})
export class LabelListProjectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() projectId: string;
  @Input() taskId: string;
  public title: string;
  public labels: Label[];
  public taskLabels: Label[];
  public currentLabel: Label;
  public isModal: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private labelService: LabelService) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskId && changes.taskId.currentValue) {
      this.retrieveTaskLabels();
    }
  }

  public ngOnInit(): void {
    this.retrieveTaskLabels();
    this.retrieveLabels();
  }

  public refreshList(): void {
    this.currentLabel = null;
    this.retrieveLabels();
  }

  private retrieveLabels(): void {
    this.subscription.add(this.labelService.getLabelsFromProject(this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.labels = data;
      }));
  }

  private retrieveTaskLabels(): void {
    this.subscription.add(this.labelService.getLabelsFromTask(this.taskId, this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.taskLabels = data;
      }));
  }

  public setActiveLabel(label): void {
    this.currentLabel = label;
    this.isModal = !this.isModal;
  }

  public closeModal(value: boolean): void {
    this.isModal = !value;
  }

  public trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  public choseLabel(label): void{
    this.currentLabel = label;
    const labelSet = new Set(this.currentLabel.taskId);
    if (labelSet.has(this.taskId)){
      labelSet.delete(this.taskId);
    }
    else{
      labelSet.add(this.taskId);
    }
    const labelData = {
      taskId: [...labelSet],
    };
    this.labelService.updateLabel(this.currentLabel.uid, labelData)
      .catch(err => console.log(err));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
