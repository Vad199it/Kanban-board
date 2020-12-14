import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TasksListComponent } from '../../components/tasks-list/tasks-list.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import {FormsModule} from '@angular/forms';
import { TasksListDetailsComponent } from '../../components/tasks-list-details/tasks-list-details.component';


@NgModule({
  declarations: [
    BoardComponent,
    TasksListComponent,
    TasksListDetailsComponent
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    DashboardModule,
    FormsModule
  ]
})
export class BoardModule { }
