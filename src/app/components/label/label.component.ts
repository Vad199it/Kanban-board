import {Component, Input, OnInit} from '@angular/core';
import Label from '../../models/label';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {LabelService} from '../../services/label.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() taskId: string;
  label: Label;
  public submitted: boolean = false;
  public addBoardImg = '../../../assets/add-board.png';
  id: string;
  constructor(private activateRoute: ActivatedRoute,
              private labelService: LabelService) { }

  ngOnInit(): void {
    this.getUrlParam();
  }

  getUrlParam(): void{
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('uid'))
    )
      .subscribe(data => this.id = data);
  }

  saveLabel(): void {
    this.label.projectId = this.id;
    const date = new Date();
    this.label.order = +date;
    this.labelService.createLabel(this.label).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
    });
  }

  newLabel(): void {
    this.submitted = true;
    this.label = new Label();
  }

}
