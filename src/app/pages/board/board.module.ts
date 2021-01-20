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
import { LabelComponent } from '../../components/label/label.component';
import { LabelListProjectComponent } from '../../components/label-list-project/label-list-project.component';
import { LabelListProjectDetailsComponent } from '../../components/label-list-project-details/label-list-project-details.component';
import { LabelListTaskComponent } from '../../components/label-list-task/label-list-task.component';
import { FileFormComponent } from '../../components/file-form/file-form.component';
import { FileListComponent } from '../../components/file-list/file-list.component';
import { FileDetailsComponent } from '../../components/file-details/file-details.component';
import {FilterTasksPipe} from '../../pipes/filterTasks.pipe';
import {LabelFilterPipe} from '../../pipes/labelFilter.pipe';


@NgModule({
  declarations: [
    BoardComponent,
    TasksListComponent,
    TasksListDetailsComponent,
    TasksComponent,
    TasksDetailsComponent,
    TasksBoardComponent,
    LabelComponent,
    LabelListProjectComponent,
    LabelListProjectDetailsComponent,
    LabelListTaskComponent,
    FileFormComponent,
    FileListComponent,
    FileDetailsComponent,
    FilterTasksPipe,
    LabelFilterPipe
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    DashboardModule,
    FormsModule
  ]
})
export class BoardModule { }
