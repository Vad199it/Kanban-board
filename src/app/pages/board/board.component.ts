import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs/operators';

import {TasksListComponent} from '../../components/tasks-list/tasks-list.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  id: string;
  constructor(private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getUrlParam();
  }

  getUrlParam(): void{
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('uid'))
    )
      .subscribe(data => this.id = data);
  }
}
