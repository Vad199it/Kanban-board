import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import { formatDate } from '@angular/common';

import {TaskService} from '../../services/task.service';
import Task from '../../models/task';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  tasks: Task[];
  currentTask = null;
  // currentIndex = -1;
  title = '';
  subscription: Subscription;
  isModal: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.retrieveTasks();
  }

  refreshTask(): void {
    this.currentTask = null;
    // this.currentIndex = -1;
    this.retrieveTasks();
  }

  retrieveTasks(): void {
    this.subscription = this.taskService.getTasks(this.taskListId).valueChanges({idField: 'id'})
      .subscribe((data: Task[]) => {
        this.tasks = data;
      });
  }
  setActiveTask(task): void {
    this.currentTask = task;
    // this.currentIndex = index;
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

  getCurrentData(): string{
    return formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  }

  changeDateInSec(date: string): number{
    const currDate = new Date(date);
    return +currDate;
  }

  changeDoDateInSec(date: string): number{
    const currDate = new Date(date);
    currDate.setDate(currDate.getDate() + 1);
    return +(currDate.setHours(currDate.getHours() - 3));
  }

}
