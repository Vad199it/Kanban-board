import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, take} from 'rxjs/operators';
import {formatDate} from '@angular/common';

import {User} from '../../models/user';
import Task from '../../models/task';
import Board from '../../models/board';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import {BoardService} from '../../services/board.service';
import {TaskListService} from '../../services/task-list.service';
import TaskList from '../../models/task-list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import firebase from 'firebase/app';

@Component({
  selector: 'app-tasks-details',
  templateUrl: './tasks-details.component.html',
  styleUrls: ['./tasks-details.component.scss']
})
export class TasksDetailsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task: Task;
  @Input() taskListId: string;
  @Input() title: string;
  @Input() titleTaskList: string;
  @Input() text: string;
  @Input() comments: string[] = [];
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  public users: User[];
  public board: Board[];
  public currentTask: Task;
  public taskLists: TaskList[];
  public newTaskList: TaskList;
  public tasksId: string[];
  private boardId: string;
  private prevUserId: string;
  public isChanged: Boolean = false;
  public newTaskListId: string;
  public size: number = 1;
  public sizeTaskList: number = 1;
  private subscription: Subscription = new Subscription();
  public taskForm: FormGroup;

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private boardService: BoardService,
              private taskListService: TaskListService,
              private formBuilder: FormBuilder) {}

  public createForm(): void{
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
      dueDate: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{2}-[0-9]{2}')]],
      text: ['', []],
    });
  }

  public ngOnInit(): void {
    this.createForm();
    this.getUrlParam();
    this.retrieveUsers();
    this.retrieveBoards();
    this.retrieveTaskLists();
    this.retrieveAllTaskLists();
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
    this.title = '';
    this.titleTaskList = '';
    this.text = this.task.comments.join('');
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

  private updateTaskListInTask(newId: string, uId: string): void {
    const taskData: {id: string} = {
      id: newId,
    };
    this.taskService.updateTask(uId, taskData)
      .catch(err => console.log(err));
  }

  private getTaskListFromArrayTaskList(taskListId: string): TaskList {
    return this.taskLists.find((elem: TaskList) => (taskListId === elem.uid));
  }

  private getAndUpdateNewTaskList(taskListId: string): void {
    this.taskListService.getTaskListsById(taskListId).valueChanges({idField: 'id'})
      .pipe(
        take(1)
      )
      .subscribe((data: TaskList[]) => {
        this.newTaskList = data[0];
        const arrayOfTasksId: string[] = this.pushTaskIdFromTasksListAndReturn(this.currentTask.uid, this.newTaskList);
        this.updateTasksId(taskListId, arrayOfTasksId);
      });
  }

  private deleteTaskIdFromTasksListAndReturn(taskId: string, taskListId: string): string[]{
    const taskList: TaskList = this.getTaskListFromArrayTaskList(taskListId);
    const setOfTasksId = new Set(taskList.tasksId);
    setOfTasksId.delete(taskId);
    return [...setOfTasksId];
  }

  private pushTaskIdFromTasksListAndReturn(taskId: string, taskList: TaskList): string[]{
    const arrayOfTasksId = taskList.tasksId;
    arrayOfTasksId.unshift(taskId);
    const setOfTasksId = new Set(arrayOfTasksId);
    return [...setOfTasksId];
  }

  private updateTasksId(taskListId: string, data: string[]): Promise<void> {
    const taskListData: {tasksId: string[]} = {
      tasksId: [...data],
    };
    return this.taskListService.updateTaskList(taskListId, taskListData)
      .catch(err => console.log(err));
  }

  private changeOldTaskList(): void {
      const currArrayOfTasksId: string[] = this.deleteTaskIdFromTasksListAndReturn(this.currentTask.uid, this.taskListId);
      this.updateTasksId(this.taskListId, currArrayOfTasksId)
        .catch((error) => {});
  }

  public updateTask(): void {
    if (this.newTaskListId) {
      this.updateTaskListInTask(this.newTaskListId, this.currentTask.uid);
      this.changeOldTaskList();
      this.getAndUpdateNewTaskList(this.newTaskListId);
    }

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
        comments: string[],
        nameOfDeveloper: string
      } = {
        ownerTask: this.currentTask.ownerTask,
        doTask: this.currentTask.doTask,
        dueDate: this.currentTask.dueDate,
        title: this.currentTask.title,
        content: this.currentTask.content,
        comments: [...this.currentTask.comments, ...this.comments] || [''],
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

  private retrieveAllTaskLists(): void {
    this.subscription.add(this.taskListService.getTaskLists(this.boardId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.taskLists = data;
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

  public changeTaskListInTask(newValue: string): void {
    if (this.taskListId !== newValue) {
      this.newTaskListId = newValue;
    }
    else{
      this.newTaskListId = null;
    }
  }

  public addTextInComments(): void {
    this.comments.push(firebase.auth().currentUser.displayName + ': ' + this.taskForm.value.text + '\n');
    this.text = this.text + firebase.auth().currentUser.displayName + ': ' + this.taskForm.value.text + '\n';
    this.taskForm.get('text').setValue('');
  }

  public changeSizeToFive(): void {
    this.size = 5;
  }

  public changeSizeToOne(): void {
    this.size = 1;
  }

  public changeSizeTaskListToFive(): void {
    this.sizeTaskList = 3;
  }

  public changeSizeTaskListToOne(): void {
    this.sizeTaskList = 1;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
