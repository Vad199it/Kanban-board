import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import Board from '../../models/board';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
    this.board.ownerUsername = this.authService.userData.displayName;
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
