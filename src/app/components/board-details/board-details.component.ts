import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { BoardService } from '../../services/board.service';
import Board from '../../models/board';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnInit, OnChanges {

  @Input() board: Board;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentBoard: Board = null;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.currentBoard = { ...this.board };
  }

  updateBoard(): void {
    const data = {
      title: this.currentBoard.title,
      color: this.currentBoard.color || 'black'
    };
    console.log(data);
    this.boardService.updateBoard(this.currentBoard.id, data)
      .catch(err => console.log(err));
  }

  deleteBoard(): void {
    this.isModal.emit(true);
    this.boardService.deleteBoard(this.currentBoard.id)
      .then(() => {
        this.refreshList.emit();
      })
      .catch(err => console.log(err));
  }
}
