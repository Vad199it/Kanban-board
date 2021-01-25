import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';

import {LabelService} from '../../services/label.service';
import Label from '../../models/label';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit, OnDestroy {
  @Input() taskId: string;
  public id: string;
  public label: Label;
  public submitted: boolean = false;
  private subscription: Subscription;

  constructor(private activateRoute: ActivatedRoute,
              private labelService: LabelService) { }

  public ngOnInit(): void {
    this.getUrlParam();
  }

  private getUrlParam(): void{
    this.subscription = this.activateRoute.paramMap.pipe(
      switchMap((params: ParamMap) => params.getAll('uid'))
    )
      .subscribe((data: string) => this.id = data);
  }

  public saveLabel(): void {
    this.label.projectId = this.id;
    const date: Date = new Date();
    this.label.order = +date;
    if (!this.label.color) { this.label.color = 'black'; }
    this.labelService.createLabel(this.label).then(() => {
    });
    this.submitted = false;
  }

  public newLabel(): void {
    this.submitted = true;
    this.label = new Label();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
