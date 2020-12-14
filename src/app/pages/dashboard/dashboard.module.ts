import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {FormsModule} from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BoardsListComponent } from '../../components/boards-list/boards-list.component';
import { BoardDetailsComponent } from '../../components/board-details/board-details.component';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';


@NgModule({
    declarations: [
        DashboardComponent,
        NavbarComponent,
        BoardsListComponent,
        BoardDetailsComponent,
        ClickStopPropagationDirective],
    exports: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FormsModule
    ]
})
export class DashboardModule { }
