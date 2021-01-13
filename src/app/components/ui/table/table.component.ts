import {Component, EventEmitter, Input, Output} from '@angular/core';
import Board from '../../../models/board';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() boards: Board[];
  @Output() currentBoard: EventEmitter<Board> = new EventEmitter();
  @Output() isModal: EventEmitter<boolean> = new EventEmitter();
  public title: string;

  constructor(private router: Router) { }

  public trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  public navigateToBoard(id: string): void{
    this.router.navigate(['board' , id]);
  }

  public setActiveBoard(board): void {
    this.currentBoard.emit(board);
    this.isModal.emit(!this.isModal);
  }

}
