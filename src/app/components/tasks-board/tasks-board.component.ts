import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {formatDate} from '@angular/common';
import {Subscription} from 'rxjs';

import Task from '../../models/task';
import {User} from '../../models/user';
import Board from '../../models/board';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import {BoardService} from '../../services/board.service';
import TaskList from '../../models/task-list';
import {TaskListService} from '../../services/task-list.service';

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  public users: User[];
  public currentUser: User;
  public task: Task;
  public board: Board[];
  public tasksId: string[];
  private boardId: string;
  public submitted: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private db: AngularFirestore,
              private boardService: BoardService,
              private activateRoute: ActivatedRoute,
              private taskListService: TaskListService) { }

  public ngOnInit(): void {
    this.retrieveUsers();
    this.getUrlParam();
    this.retrieveBoards();
    this.retrieveTaskLists();
  }

  private getUrlParam(): void{
    this.subscription.add(this.activateRoute.paramMap.pipe(
      switchMap((params: ParamMap) => params.getAll('uid'))
    )
      .subscribe((data: string) => this.boardId = data));
  }

  private updateUsernamesInBoard(): void {
    const usernames: string[] = this.board[0].usernames;
    usernames.push(this.task.doTask);
    const boardData = {
      usernames: [...usernames],
    };
    this.boardService.updateBoard(this.boardId, boardData).catch(err => console.log(err));
  }

  private updateTasksIdInTaskList(): void{
    const tasksId: string[] = this.tasksId;
    tasksId.unshift(this.task.uid);
    const taskListData = {
      tasksId: [...tasksId],
    };
    this.taskListService.updateTaskList(this.taskListId, taskListData).catch(err => console.log(err));
  }

  public saveTask(): void {
    this.updateUsernamesInBoard();
    this.updateTasksIdInTaskList();
    this.task.id = this.taskListId;
    this.task.createDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
    this.authService.getAllUsers(this.task.doTask).valueChanges({idField: 'id'})
      .subscribe((data: User[]) => {
      this.task.nameOfDeveloper = data[0].displayName;
      this.task.ownerTask = this.authService.getUser().displayName;
      this.task.idTicket = (this.generationKey(this.task.title).toString()).substr(0, 6);
      this.taskService.createTask(this.task, this.task.uid).then(() => {
        this.submitted = false;
      });
    });
  }

  public newTask(): void {
    this.submitted = true;
    this.task = new Task();
    this.task.uid = this.db.createId();
  }

  public generationKey(str: string): number {
    let hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
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

  public getCurrentDate(): string{
    return formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
