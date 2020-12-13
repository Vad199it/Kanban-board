import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TasksListComponent } from '../../components/tasks-list/tasks-list.component';


@NgModule({
  declarations: [
    BoardComponent,
    TasksListComponent,
  ],
  imports: [
    CommonModule,
    BoardRoutingModule
  ]
})
export class BoardModule { }
