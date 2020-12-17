import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { formatDate } from '@angular/common';

import {TaskService} from '../../services/task.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  @Input() taskListId: string;
  tasks: any;
  currentTask = null;
  currentIndex = -1;
  title = '';
  subscription: Subscription;
  isModal: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.retrieveTasks();
  }

  refreshTask(): void {
    this.currentTask = null;
    this.currentIndex = -1;
    this.retrieveTasks();
  }

  retrieveTasks(): void {
    this.subscription = this.taskService.getTasks(this.taskListId).valueChanges({idField: 'id'})
      .subscribe(data => {
        this.tasks = data;
      });
  }
  setActiveTask(task, index): void {
    this.currentTask = task;
    this.currentIndex = index;
    this.isModal = !this.isModal;
    console.log(this.currentTask.dueDate);
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
}
