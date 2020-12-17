import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import { ActivatedRoute} from '@angular/router';

import {LabelService} from '../../services/label.service';
import {switchMap} from 'rxjs/operators';
import Label from '../../models/label';

@Component({
  selector: 'app-label-list-task',
  templateUrl: './label-list-task.component.html',
  styleUrls: ['./label-list-task.component.scss']
})
export class LabelListTaskComponent implements OnInit, OnDestroy {

  @Input() taskId: string;
  labels: Label[];
  currentLabel = null;
  currentIndex = -1;
  title: string = '';
  subscription: Subscription;
  projectId: string;
  constructor(private labelService: LabelService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUrlParam();
    this.retrieveLabels();
  }

  getUrlParam(): void{
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('uid'))
    )
      .subscribe(data => this.projectId = data);
  }

  refreshList(): void {
    this.currentLabel = null;
    this.currentIndex = -1;
    this.retrieveLabels();
  }

  retrieveLabels(): void {
    this.subscription = this.labelService.getLabelsFromTask(this.taskId, this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: Label[]) => {
        this.labels = data;
      });
  }

  deleteLabelFromTask(board, index): void {
    this.currentLabel = board;
    const set = new Set(this.currentLabel.taskId);
    set.delete(this.taskId);
    const labelData = {
      taskId: [...set],
    };
    this.labelService.updateLabel(this.currentLabel.uid, labelData)
      .catch(err => console.log(err));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

}
