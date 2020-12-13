import { Component, OnInit } from '@angular/core';
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
  public addBoardImg = '../../../assets/add-board.png';

  constructor(private boardService: BoardService,
              public authService: AuthService) {}

  ngOnInit(): void {
  }

  saveBoard(): void {
    this.board.ownerUsername = this.authService.getUser().displayName;
    this.board.id = this.authService.getUser().uid;
    this.board.taskLists = [];
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
