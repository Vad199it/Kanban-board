import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { BoardService } from '../../services/board.service';
import Board from '../../models/board';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.css']
})
export class BoardDetailsComponent implements OnInit, OnChanges {

  @Input() board: Board;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentBoard: Board = null;
  message = '';

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentBoard = { ...this.board };
  }

  updateBoard(): void {
    const data = {
      title: this.currentBoard.title,
      type: this.currentBoard.type,
      color: this.currentBoard.color
    };
    this.boardService.updateBoard(this.currentBoard.id, data)
      .then(() => this.message = 'The board was updated successfully!')
      .catch(err => console.log(err));
  }

  deleteBoard(): void {
    this.boardService.deleteBoard(this.currentBoard.id)
      .then(() => {
        this.refreshList.emit();
        this.message = 'The board was updated successfully!';
      })
      .catch(err => console.log(err));
  }
}
