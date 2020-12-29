import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import Task from '../../models/task';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {Observable, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import Board from '../../models/board';
import {BoardService} from '../../services/board.service';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.css']
})
export class TasksBoardComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  users: User[];
  currentUser = null;
  task: Task;
  public submitted: boolean = false;
  public addBoardImg = '../../../assets/add-board.png';
  id: string;
  subscription: Subscription;
  board: Board[];
  boardId: string;

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private db: AngularFirestore,
              private boardService: BoardService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.retrieveUsers();
    this.getUrlParam();
    this.retrieveBoards();
  }

  getUrlParam(): void{
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('uid'))
    )
      .subscribe(data => this.boardId = data);
  }

  saveTask(): void {
    const set: string[] = this.board[0].usernames;
    set.push(this.task.doTask);
    const boardData = {
      usernames: [...set],
    };
    this.boardService.updateBoard(this.boardId, boardData).catch(err => console.log(err));
    this.task.id = this.taskListId;
    this.task.ownerTask = this.authService.getUser().displayName;
    this.task.idTicket = (this.generationKey(this.task.title).toString()).substr(0, 6);
    this.taskService.createTask(this.task, this.task.uid).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
    });
  }
  newTask(): void {
    this.submitted = true;
    this.task = new Task();
    this.task.uid = this.db.createId();
  }

  generationKey(str: string): number {
    let hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  retrieveBoards(): void {
    this.subscription = this.boardService.getAllBoards(this.boardId).valueChanges({idField: 'uid'})
      .subscribe((data: Board[]) => {
        this.board = data;
        console.log(this.board);
      });
  }

  retrieveUsers(): void {
    this.subscription = this.authService.getUsers().valueChanges({idField: 'id'})
      .subscribe((data: User[]) => {
        this.users = data;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
