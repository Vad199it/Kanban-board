import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {formatDate} from '@angular/common';

import {User} from '../../models/user';
import Task from '../../models/task';
import Board from '../../models/board';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import {BoardService} from '../../services/board.service';
import {TaskListService} from '../../services/task-list.service';
import TaskList from '../../models/task-list';

@Component({
  selector: 'app-tasks-details',
  templateUrl: './tasks-details.component.html',
  styleUrls: ['./tasks-details.component.scss']
})
export class TasksDetailsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task: Task;
  @Input() taskListId: string;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  public users: User[];
  public board: Board[];
  public tasksId: string[];
  public currentTask: Task;
  private boardId: string;
  private prevUserId: string;
  public isChanged: Boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private boardService: BoardService,
              private taskListService: TaskListService) { }

  public ngOnInit(): void {
    this.getUrlParam();
    this.retrieveUsers();
    this.retrieveBoards();
    this.retrieveTaskLists();
  }

  private getUrlParam(): void{
    this.subscription.add(this.activateRoute.paramMap.pipe(
      switchMap((params: ParamMap) => params.getAll('uid'))
    )
      .subscribe((data: string) => this.boardId = data));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      this.currentTask = {...this.task};
    }
    this.prevUserId = this.currentTask.doTask;
  }

  public changeUserInBoard(newValue: string): void {
    this.currentTask.doTask = newValue;
    this.isChanged = true;
  }

  private changeUsername(prevUserId: string, currUserId: string): void{
    let usernames: string[] = this.board[0].usernames;
    usernames = this.removeFirst(usernames, prevUserId);
    usernames.push(currUserId);
    const boardData = {
      usernames: [...usernames],
    };
    this.boardService.updateBoard(this.boardId, boardData).catch(err => console.log(err));
    this.isChanged = false;
  }

  public updateTask(): void {
    if (this.isChanged) {
      if (this.prevUserId !== this.currentTask.doTask) {
        this.changeUsername(this.prevUserId, this.currentTask.doTask);
      }
    }
    this.prevUserId = this.currentTask.doTask;
    this.subscription.add(this.authService.getAllUsers(this.currentTask.doTask).valueChanges({idField: 'id'})
      .subscribe((users: User[]) => {
      this.currentTask.nameOfDeveloper = users[0].displayName;
      const data: {
        ownerTask: string,
        doTask: string,
        dueDate: Date,
        title: string,
        content: string,
        comments: string,
        nameOfDeveloper: string
      } = {
        ownerTask: this.currentTask.ownerTask,
        doTask: this.currentTask.doTask,
        dueDate: this.currentTask.dueDate,
        title: this.currentTask.title,
        content: this.currentTask.content,
        comments: this.currentTask.comments,
        nameOfDeveloper: this.currentTask.nameOfDeveloper,
      };
      this.taskService.updateTask(this.currentTask.id, data)
        .then(() => {
          this.isModal.emit(true);
        })
        .catch(err => console.log(err));
    }));
  }

  private deleteUsernameFromBoard(): void{
    let usernames: string[] = this.board[0].usernames;
    usernames = this.removeFirst(usernames, this.currentTask.doTask);
    const boardData = {
      usernames: [...usernames],
    };
    this.boardService.updateBoard(this.boardId, boardData).catch(err => console.log(err));
  }

  private deleteTaskIdFromTaskList(): void {
    const tasksId = new Set(this.tasksId);
    tasksId.delete(this.currentTask.id);
    const taskListData = {
      tasksId: [...tasksId],
    };
    this.taskListService.updateTaskList(this.taskListId, taskListData).catch(err => console.log(err));
  }

  public deleteTask(): void {
    this.isModal.emit(true);
    this.deleteUsernameFromBoard();
    this.deleteTaskIdFromTaskList();
    this.taskService.deleteTask(this.currentTask.id)
      .then(() => {
        this.refreshList.emit();
      })
      .catch(err => console.log(err));
  }

  private retrieveBoards(): void {
    this.subscription.add(this.boardService.getAllBoards(this.boardId).valueChanges({idField: 'uid'})
      .subscribe((data: Board[]) => {
        this.board = data;
      }));
  }

  private retrieveUsers(): void {
    this.subscription.add(this.authService.getUsers().valueChanges({idField: 'id'})
      .subscribe((data: User[]) => {
        this.users = data;
      }));
  }

  private retrieveTaskLists(): void {
    this.subscription.add(this.taskListService.getTaskListsById(this.taskListId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.tasksId = data[0].tasksId;
      }));
  }

  public removeFirst(src: string[], element: string): string[] {
    const index = src.indexOf(element);
    if (index === -1) { return src; }
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  public getCurrentDate(): string{
    return formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
