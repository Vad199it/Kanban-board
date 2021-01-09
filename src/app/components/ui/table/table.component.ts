import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Board from '../../../models/board';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() boards: Board[];
  @Input() title: string;
  @Output() currentBoard: EventEmitter<Board> = new EventEmitter();
  @Output() isModal: EventEmitter<boolean> = new EventEmitter();


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  navigateToBoard(id: string): void{
    this.router.navigate(['board' , id]);
  }

  setActiveBoard(board): void {
    this.currentBoard.emit(board);
    this.isModal.emit(!this.isModal);
  }

}
