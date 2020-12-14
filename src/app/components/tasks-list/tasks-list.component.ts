import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskListService } from '../../services/task-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  taskLists: any;
  currentTaskList = null;
  currentIndex = -1;
  title = '';
  subscription: Subscription;
  isModal: boolean = false;

  constructor(private taskListService: TaskListService) { }

  ngOnInit(): void {
    this.retrieveTaskLists();
  }

  refreshTaskList(): void {
    this.currentTaskList = null;
    this.currentIndex = -1;
    this.retrieveTaskLists();
  }

  retrieveTaskLists(): void {
    this.subscription = this.taskListService.getTaskLists(this.projectId).valueChanges({idField: 'id'})
      .subscribe(data => {
        this.taskLists = data;
      });
  }

  setActiveTaskList(board, index): void {
    this.currentTaskList = board;
    this.currentIndex = index;
    this.isModal = !this.isModal;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  closeModal(value: boolean): void {
    this.isModal = !value;
  }
}
