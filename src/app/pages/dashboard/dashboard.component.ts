import {Component} from '@angular/core';

import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import Board from '../../models/board';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public board: Board;
  public submitted: boolean = false;

  constructor(private boardService: BoardService,
              private authService: AuthService) {}

  public saveBoard(): void {
    this.board.ownerUsername = this.authService.getUser().displayName;
    this.board.id = this.authService.getUser().uid;
    const date: Date = new Date();
    this.board.order = +date;
    if (!this.board.color) { this.board.color = 'black'; }
    this.boardService.createBoard(this.board).then(() => {
      this.submitted = false;
    });
  }

  public newBoard(): void {
    this.submitted = true;
    this.board = new Board();
  }
}
