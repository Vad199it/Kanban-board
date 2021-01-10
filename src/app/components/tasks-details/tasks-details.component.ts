import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import Task from '../../models/task';
import {TaskService} from '../../services/task.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import { ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {BoardService} from '../../services/board.service';
import Board from '../../models/board';

@Component({
  selector: 'app-tasks-details',
  templateUrl: './tasks-details.component.html',
  styleUrls: ['./tasks-details.component.css']
})
export class TasksDetailsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task: Task;
  users: User[];
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentTask: Task = null;
  subscription: Subscription;
  currentUser = null;
  boardId: string;
  prevUserId: string;
  board: Board[];
  isChanged: boolean = false;

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private boardService: BoardService) { }

  ngOnInit(): void {
    this.getUrlParam();
    this.retrieveUsers();
    this.retrieveBoards();
    console.log(this.currentTask.doTask);
  }

  getUrlParam(): void{ // todo: ????
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('uid'))
    )
      .subscribe(data => this.boardId = data);
  }

  ngOnChanges(): void {
    this.currentTask = { ...this.task };
  }

  changeUserInBoard(newValue: string): void {
    this.prevUserId = this.currentTask.doTask;
    this.currentTask.doTask = newValue;
    this.isChanged = true;
  }

  async updateTask(): Promise<void> {
    if (this.isChanged){
      let set: string[] = this.board[0].usernames;
      set = this.removeFirst(set, this.prevUserId);
      set.push(this.currentTask.doTask);
      const boardData = {
        usernames: [...set],
      };
      this.boardService.updateBoard(this.boardId, boardData).catch(err => console.log(err));
      this.isChanged = false;
    }
    await this.authService.getAllUsers(this.currentTask.doTask).valueChanges({idField: 'id'}).subscribe((users: User[]) => {
      this.currentTask.nameOfDeveloper = users[0].displayName;
      const data = {
        ownerTask: this.currentTask.ownerTask,
        doTask: this.currentTask.doTask,
        createDate: this.currentTask.createDate,
        dueDate: this.currentTask.dueDate,
        title: this.currentTask.title,
        content: this.currentTask.content,
        order: this.currentTask.order,
        comments: this.currentTask.comments,
        nameOfDeveloper: this.currentTask.nameOfDeveloper,
      };
      this.taskService.updateTask(this.currentTask.id, data)
        .catch(err => console.log(err));
    });
  }

  deleteTask(): void {
    this.isModal.emit(true);
    let set: string[] = this.board[0].usernames;
    set = this.removeFirst(set, this.currentTask.doTask);
    const boardData = {
      usernames: [...set],
    };
    this.boardService.updateBoard(this.boardId, boardData).catch(err => console.log(err));

    this.taskService.deleteTask(this.currentTask.id)
      .then(() => {
        this.refreshList.emit();
      })
      .catch(err => console.log(err));
  }

  retrieveBoards(): void {
    this.subscription = this.boardService.getAllBoards(this.boardId).valueChanges({idField: 'uid'})
      .subscribe((data: Board[]) => {
        this.board = data;
      });
  }
  retrieveUsers(): void {
    this.subscription = this.authService.getUsers().valueChanges({idField: 'id'})
      .subscribe((data: User[]) => {
        this.users = data;
      });
  }

  removeFirst(src: string[], element: string): string[] {
    const index = src.indexOf(element);
    if (index === -1) { return src; }
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
