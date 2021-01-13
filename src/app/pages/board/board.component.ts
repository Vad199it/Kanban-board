import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

import TaskList from '../../models/task-list';
import {TaskListService} from '../../services/task-list.service';
import {BoardService} from '../../services/board.service';
import Board from '../../models/board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy{
  public boards: Observable<Board[]>;
  public taskList: TaskList;
  public submitted: boolean = false;
  public isFinalList: boolean = false;
  public id: string;
  private subscription: Subscription;

  constructor(private activateRoute: ActivatedRoute,
              private taskListService: TaskListService,
              private boardService: BoardService) {
  }

  public ngOnInit(): void {
    this.getUrlParam();
    this.retrieveBoards();
  }

  private retrieveBoards(): void {
    this.boards = this.boardService.getAllBoards(this.id).valueChanges({idField: 'id'});
  }

  private getUrlParam(): void{
    this.subscription = this.activateRoute.paramMap.pipe(
      switchMap((params: ParamMap) => params.getAll('uid'))
    )
      .subscribe((data: string) => this.id = data);
  }

  public saveTaskList(): void {
    const date: Date = new Date();
    this.taskList.id = this.id;
    this.taskList.order = +date;
    this.taskList.isFinalList = this.isFinalList;
    this.taskListService.createTaskList(this.taskList).then(() => {
      this.submitted = false;
      this.isFinalList = false;
    });
  }

  public newTaskList(): void {
    this.submitted = true;
    this.taskList = new TaskList();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
