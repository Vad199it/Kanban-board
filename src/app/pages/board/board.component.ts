import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs/operators';

import TaskList from '../../models/task-list';
import {TaskListService} from '../../services/task-list.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  taskList: TaskList;
  public submitted: boolean = false;
  public addBoardImg = '../../../assets/add-board.png';
  id: string;
  constructor(private activateRoute: ActivatedRoute,
              private taskListService: TaskListService) {
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

  saveTaskList(): void {
    this.taskList.id = this.id;
    this.taskListService.createTaskList(this.taskList).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
    });
  }

  newTaskList(): void {
    this.submitted = true;
    this.taskList = new TaskList();
  }
}
