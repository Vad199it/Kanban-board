import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskListService } from '../../services/task-list.service';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import Task from '../../models/task';

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

  task: Task;
  public submitted: boolean = false;
  public addBoardImg = '../../../assets/add-board.png';
  id: string;

  constructor(private taskListService: TaskListService,
              private taskService: TaskService,
              private authService: AuthService) { }

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

  setActiveTaskList(taskList, index): void {
    this.currentTaskList = taskList;
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

  saveTask(taskListId: string): void {
    this.task.id = taskListId;
    this.task.ownerTask = this.authService.getUser().displayName;
    console.log(this.task);
    this.taskService.createTask(this.task).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
    });
  }
  newTask(): void {
    this.submitted = true;
    this.task = new Task();
  }
}
