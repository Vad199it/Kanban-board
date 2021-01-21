import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {LabelService} from '../../services/label.service';
import Label from '../../models/label';

@Component({
  selector: 'app-label-list-task',
  templateUrl: './label-list-task.component.html',
  styleUrls: ['./label-list-task.component.scss']
})
export class LabelListTaskComponent implements OnInit, OnDestroy, OnChanges {

  @Input() taskId: string;
  public labels: Label[];
  public currentLabel: Label;
  private projectId: string;
  private subscription: Subscription = new Subscription();

  constructor(private labelService: LabelService,
              private activateRoute: ActivatedRoute) { }

  public ngOnInit(): void {
    this.getUrlParam();
    this.retrieveLabels();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskId && changes.taskId.currentValue) {
      this.getUrlParam();
      this.retrieveLabels();
    }
  }

  private getUrlParam(): void{
    this.subscription.add(this.activateRoute.paramMap.pipe(
      switchMap((params: ParamMap) => params.getAll('uid'))
    )
      .subscribe((data: string) => this.projectId = data));
  }

  public refreshList(): void {
    this.currentLabel = null;
    this.retrieveLabels();
  }

  private retrieveLabels(): void {
    this.subscription.add(this.labelService.getLabelsFromTask(this.taskId, this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.labels = data;
      }));
  }

  public deleteLabelFromTask(board): void {
    this.currentLabel = board;
    const labelSet = new Set(this.currentLabel.taskId);
    labelSet.delete(this.taskId);
    const labelData = {
      taskId: [...labelSet],
    };
    this.labelService.updateLabel(this.currentLabel.uid, labelData)
      .catch(err => console.log(err));
  }

  public trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
