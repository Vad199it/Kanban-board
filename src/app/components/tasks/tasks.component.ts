import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import { formatDate } from '@angular/common';

import {TaskService} from '../../services/task.service';
import Task from '../../models/task';
import {User} from '../../models/user';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import Board from '../../models/board';
import {BoardService} from '../../services/board.service';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  projectId: string;
  tasks: Task[];
  currentTask = null;
  title = '';
  subscription: Subscription;
  isModal = false;
  boardName: string;

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private boardService: BoardService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUrlParam();
    this.retrieveTasks();
    this.retrieveBoards();
  }

  getUrlParam(): void{
    this.activateRoute.paramMap.pipe(
        switchMap(params => params.getAll('uid'))
    )
        .subscribe(data => this.projectId = data);
  }

  refreshTask(): void {
    this.currentTask = null;
    this.retrieveTasks();
  }

  retrieveBoards(): void {
    this.subscription = this.boardService.getAllBoards(this.projectId).valueChanges({idField: 'uid'})
      .subscribe((data: Board[]) => {
        this.boardName = data[0].title;
      });
  }

  retrieveTasks(): void {
    this.subscription = this.taskService.getTasks(this.taskListId).valueChanges({idField: 'id'})
      .subscribe((data: Task[]) => {
        this.tasks = data;
      });
  }
  setActiveTask(task): void {
    this.currentTask = task;
    // this.currentIndex = index;
    this.isModal = !this.isModal;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  closeModal(value: boolean): void {
    this.isModal = !value;
  }

  getCurrentData(): string{
    return formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  }

  changeDateInSec(date: string): number{
    const currDate = new Date(date);
    return +currDate;
  }

  changeDoDateInSec(date: string): number{
    const currDate = new Date(date);
    currDate.setDate(currDate.getDate() + 1);
    return +(currDate.setHours(currDate.getHours() - 3));
  }

}
