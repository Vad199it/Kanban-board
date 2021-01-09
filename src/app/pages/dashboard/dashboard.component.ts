import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import Board from '../../models/board';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  board: Board;
  public submitted: boolean = false;

  constructor(private boardService: BoardService,
              private authService: AuthService) {}

  ngOnInit(): void {
  }

  saveBoard(): void {
    this.board.ownerUsername = this.authService.getUser().displayName;
    this.board.id = this.authService.getUser().uid;
    const date = new Date();
    this.board.order = +date;
    this.boardService.createBoard(this.board).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
    });
  }

  newBoard(): void {
    this.submitted = true;
    this.board = new Board();
  }
}
