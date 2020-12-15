import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TasksListComponent } from '../../components/tasks-list/tasks-list.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import {FormsModule} from '@angular/forms';
import { TasksListDetailsComponent } from '../../components/tasks-list-details/tasks-list-details.component';
import { TasksComponent } from '../../components/tasks/tasks.component';
import { TasksDetailsComponent } from '../../components/tasks-details/tasks-details.component';
import { TasksBoardComponent } from '../../components/tasks-board/tasks-board.component';


@NgModule({
  declarations: [
    BoardComponent,
    TasksListComponent,
    TasksListDetailsComponent,
    TasksComponent,
    TasksDetailsComponent,
    TasksBoardComponent
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    DashboardModule,
    FormsModule
  ]
})
export class BoardModule { }
