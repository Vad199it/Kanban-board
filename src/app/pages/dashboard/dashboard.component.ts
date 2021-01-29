import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BoardService} from '../../services/board.service';
import {AuthService} from '../../services/auth.service';
import Board from '../../models/board';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public board: Board;
  public submitted: boolean = false;
  public boardForm: FormGroup;

  constructor(private boardService: BoardService,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
  }

  public ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  public saveBoard(): void {
    this.board.ownerUsername = this.authService.getUser().displayName;
    this.board.id = this.authService.getUser().uid;
    const date: Date = new Date();
    this.board.order = +date;
    if (!this.board.color) {
      this.board.color = 'black';
    }
    this.boardService.createBoard(this.board).then(() => {
    });
    this.submitted = false;
    this.boardForm.markAsUntouched();
  }

  public newBoard(): void {
    this.submitted = true;
    this.board = new Board();
  }

  public closeModal(): void {
    this.submitted = !this.submitted;
    this.boardForm.markAsUntouched();
  }
}
