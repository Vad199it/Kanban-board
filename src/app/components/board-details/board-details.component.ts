import {Component, Input, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { BoardService } from '../../services/board.service';
import Board from '../../models/board';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnChanges {
  @Input() board: Board;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  public currentBoard: Board;
  public boardForm: FormGroup;

  constructor(private boardService: BoardService,
              private formBuilder: FormBuilder) {
    this.boardForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.board && changes.board.currentValue) {
      this.currentBoard = { ...this.board };
    }
  }

  public updateBoard(): void {
    const data: {title: string, color: string} = {
      title: this.currentBoard.title,
      color: this.currentBoard.color || 'black'
    };
    this.boardService.updateBoard(this.currentBoard.id, data)
      .then(() => {
        this.isModal.emit(true);
      })
      .catch(err => console.log(err));
  }

  public deleteBoard(): void {
    this.isModal.emit(true);
    this.boardService.deleteBoard(this.currentBoard.id)
      .then(() => {
        this.refreshList.emit();
      })
      .catch(err => console.log(err));
  }
}
