import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';

import {LabelService} from '../../services/label.service';
import Label from '../../models/label';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  public labelForm: FormGroup;

  constructor(private activateRoute: ActivatedRoute,
              private labelService: LabelService,
              private formBuilder: FormBuilder) {
    this.labelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

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
    this.labelForm.markAsUntouched();
  }

  public newLabel(): void {
    this.submitted = true;
    this.label = new Label();
  }

  public closeModal(): void{
    this.submitted = !this.submitted;
    this.labelForm.markAsUntouched();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
