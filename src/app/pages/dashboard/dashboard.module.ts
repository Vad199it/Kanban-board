import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BoardsListComponent } from '../../components/boards-list/boards-list.component';
import { BoardDetailsComponent } from '../../components/board-details/board-details.component';
import {FilterPipe} from '../../pipes/filter.pipe';
import { TableComponent } from '../../components/ui/table/table.component';


@NgModule({
    declarations: [
        DashboardComponent,
        NavbarComponent,
        BoardsListComponent,
        BoardDetailsComponent,
      TableComponent,
        FilterPipe
    ],
  exports: [
    NavbarComponent,
    FilterPipe,
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class DashboardModule { }
