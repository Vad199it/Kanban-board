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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import firebase from 'firebase/app';

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  @Input() taskListIsFinalList: boolean;
  public users: User[];
  public currentUser: User;
  public task: Task;
  public board: Board[];
  public tasksId: string[];
  public comments: string[] = [];
  public size: number = 1;
  public text: string = '';
  private boardId: string;
  public title: string;
  public submitted: boolean = false;
  public isOpened: boolean = false;
  public isSearchOpen: boolean = false;
  public valid: boolean = false;
  private subscription: Subscription = new Subscription();
  public taskForm: FormGroup;

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private db: AngularFirestore,
              private boardService: BoardService,
              private activateRoute: ActivatedRoute,
              private taskListService: TaskListService,
              private formBuilder: FormBuilder) {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
      develop: ['' , [Validators.required]],
      dueDate: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{2}-[0-9]{2}')]],
      text: ['', []],
      comments: [{value: '', disabled: true}, []],
      title: ['', []],
    });
  }

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

  public saveDataInTask(): void {
    this.task.title = this.taskForm.value.name;
    this.task.content = this.taskForm.value.content;
    this.task.dueDate = this.taskForm.value.dueDate;
    this.task.doTask = this.taskForm.value.develop;
  }

  public saveTask(): void {
    this.saveDataInTask();
    this.updateUsernamesInBoard();
    this.updateTasksIdInTaskList();
    this.task.id = this.taskListId;
    this.task.comments = this.comments;
    this.task.createDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
    this.authService.getAllUsers(this.task.doTask).valueChanges({idField: 'id'})
      .subscribe((data: User[]) => {
      this.task.nameOfDeveloper = data[0].displayName;
      this.task.ownerTask = this.authService.getUser().displayName;
      this.task.idTicket = (this.generationKey(this.task.title).toString()).substr(0, 6);
      this.taskForm.reset();
      this.taskForm.get('develop').setValue('');
      this.taskService.createTask(this.task, this.task.uid).then(() => {
      });
    });
    this.comments = [];
    this.text = '';
    this.submitted = false;
    this.title = '';
    this.taskForm.markAsUntouched();
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

  public closeModal(): void {
    this.submitted = !this.submitted;
    this.taskForm.markAsUntouched();
    this.comments = [];
    this.text = '';
    this.title = '';
    this.taskForm.reset();
    this.taskForm.get('develop').setValue('');
  }

  public addTextInComments(): void {
    this.comments.push(firebase.auth().currentUser.displayName + ': ' + this.taskForm.value.text + '\n');
    this.text = this.text + firebase.auth().currentUser.displayName + ': ' + this.taskForm.value.text + '\n';
    this.taskForm.get('text').setValue('');
  }

  public changeSizeToFive(): void {
    this.size = 5;
    this.isOpened = true;
  }

  public changeSizeToOne(): void {
    this.size = 1;
    this.isOpened = false;
  }

  public changeSizeToOneSearch(): void {
    // this.size = 1;
    this.isOpened = false;
  }

  public changeSizeToFiveSearch(): void {
    this.size = 5;
    this.isOpened = true;
    this.isSearchOpen = true;
  }

  public changeSizeToOneForm(e: any): void {
    if (!e.target.closest('.searchUser-container')) {
      this.size = 1;
      if ((!this.taskForm.value.develop && this.isOpened) || (!this.taskForm.value.develop && this.isSearchOpen)) {
        this.valid = true;
        this.isSearchOpen = false;
      }
      this.isOpened = false;
    }
  }

  public changeSizeToOneOption(e: any): void {
    e.target.blur();
    this.size = 5;
    this.isOpened = true;
  }

  public changeTitle(): void{
    this.title = this.taskForm.value.title;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
