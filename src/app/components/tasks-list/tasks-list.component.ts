import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskListService } from '../../services/task-list.service';
import TaskList from '../../models/task-list';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  public taskLists: TaskList[];
  public currentTaskList: TaskList = null;
  public isModal: boolean = false;
  private subscription: Subscription;

  constructor(private taskListService: TaskListService) { }

  public ngOnInit(): void {
    this.retrieveTaskLists();
  }

  public refreshTaskList(): void {
    this.currentTaskList = null;
    this.retrieveTaskLists();
  }

  private retrieveTaskLists(): void {
    this.subscription = this.taskListService.getTaskLists(this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.taskLists = data;
      });
  }

  public setActiveTaskList(taskList: TaskList): void {
    this.currentTaskList = taskList;
    this.isModal = !this.isModal;
  }

  public trackByMethod(index: number, el: any): number {
    return el.uid;
  }

  public closeModal(value: boolean): void {
    this.isModal = !value;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
