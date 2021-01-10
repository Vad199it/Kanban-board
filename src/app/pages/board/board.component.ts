import {Component, OnInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs/operators';

import TaskList from '../../models/task-list';
import {TaskListService} from '../../services/task-list.service';
import {BoardService} from '../../services/board.service';
import Board from '../../models/board';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{
  taskList: TaskList;

  public submitted: boolean = false;
  isFinalList: boolean = false;
  id: string;
  boards: Observable<Board[]>;
  constructor(private activateRoute: ActivatedRoute,
              private taskListService: TaskListService,
              private boardService: BoardService) {
  }

  ngOnInit(): void {
    this.getUrlParam();
    this.retrieveBoards();
  }

  retrieveBoards(): void {
    this.boards = this.boardService.getAllBoards(this.id).valueChanges({idField: 'id'});
  }

  getUrlParam(): void{
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('uid'))
    )
      .subscribe(data => this.id = data);
  }

  saveTaskList(): void {
    const date = new Date();
    this.taskList.id = this.id;
    this.taskList.order = +date;
    this.taskList.isFinalList = this.isFinalList;
    this.taskListService.createTaskList(this.taskList).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
      this.isFinalList = false;
    });
  }

  newTaskList(): void {
    this.submitted = true;
    this.taskList = new TaskList();
  }
}
