import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import { formatDate } from '@angular/common';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';

import {TaskService} from '../../services/task.service';
import Task from '../../models/task';
import {AuthService} from '../../services/auth.service';
import Board from '../../models/board';
import {BoardService} from '../../services/board.service';
import {TaskListService} from '../../services/task-list.service';
import TaskList from '../../models/task-list';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  private projectId: string;
  public boardName: string;
  public tasksId: string[];
  public tasks: Task[];
  public currentTask: Task;
  public isModal: Boolean = false;
  public isFinalList: boolean;
  subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private boardService: BoardService,
              private taskListService: TaskListService,
              private activateRoute: ActivatedRoute) { }

  public ngOnInit(): void {
    this.getUrlParam();
    // this.retrieveTasks();
    this.retrieveBoards();
    this.retrieveTaskLists();
  }

  private getUrlParam(): void{
    this.subscription.add(this.activateRoute.paramMap.pipe(
        switchMap((params: ParamMap) => params.getAll('uid'))
    )
        .subscribe((data: string) => this.projectId = data));
  }

  public refreshTask(): void {
    this.currentTask = null;
    this.retrieveTaskLists();
  }

  private retrieveBoards(): void {
    this.subscription.add(this.boardService.getAllBoards(this.projectId).valueChanges({idField: 'uid'})
      .subscribe((data: Board[]) => {
        this.boardName = data[0].title;
      }));
  }

  private retrieveTaskLists(): void {
    this.subscription.add(this.taskListService.getTaskListsById(this.taskListId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.isFinalList = data[0].isFinalList;
        this.tasksId = data[0].tasksId;
        this.retrieveTasks();
      }));
  }

  private retrieveTasks(): void {
    this.subscription.add(this.taskService.getTasks(this.taskListId).valueChanges({idField: 'id'})
      .subscribe((data: Task[]) => {
        this.tasks = data;
      }));
  }

  /*private retrieveTasks(tasksId: string[]): void {
    this.subscription.add(this.taskService.getTasksFromTaskList(tasksId).valueChanges({idField: 'id'})
      .subscribe((data: Task[]) => {
        this.tasks = data;
      }));
  }*/

  public setActiveTask(task: Task): void {
    this.currentTask = task;
    this.isModal = !this.isModal;
  }

  public trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  public closeModal(value: boolean): void {
    this.isModal = !value;
  }

  public getCurrentData(): string{
    return formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  }

  public changeDateInSec(date: string): number{
    const currDate: Date = new Date(date);
    return +currDate;
  }

  public changeDoDateInSec(date: string): number{
    const currDate: Date = new Date(date);
    currDate.setDate(currDate.getDate() + 1);
    return +(currDate.setHours(currDate.getHours() - 3));
  }

  public correctIdTicket(task: Task): string{
    return this.boardName?.split(' ').join('').substr(0, 3).toUpperCase() + '-' + task.idTicket;
  }

  public checkExpiredDate(dueDate: string): boolean{
    return ((this.changeDoDateInSec(dueDate) < this.changeDateInSec(this.getCurrentData())) && !this.isFinalList);
  }

  public startDrag(ev: any): void{
    ev.target.querySelector('.task-group').style.border = 'dashed';
    ev.dataTransfer.setData('text/plain', ev.currentTarget.id + '-' + ev.target.closest('.taskList-group').id);
  }

  public endDrag(ev: any): void{
    ev.target.querySelector('.task-group').style.border = 'none';
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
