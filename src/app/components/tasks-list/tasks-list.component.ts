import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskListService } from '../../services/task-list.service';
import TaskList from '../../models/task-list';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  private dragTasksId: string[];
  private dropTasksId: string[];
  public taskLists: TaskList[];
  public currentTaskList: TaskList;
  public isModal: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private taskListService: TaskListService,
              private taskService: TaskService) { }

  public ngOnInit(): void {
    this.retrieveTaskLists();
  }

  public refreshTaskList(): void {
    this.currentTaskList = null;
    this.retrieveTaskLists();
  }

  private retrieveTaskLists(): void {
    this.subscription.add(this.taskListService.getTaskLists(this.projectId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.taskLists = data;
      }));
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

  private deleteTaskId(prevTaskListId: string, taskId: string): void {
    this.subscription.add(this.taskListService.getTaskListsById(prevTaskListId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.dragTasksId = this.removeFirst(data[0].tasksId, taskId);
        this.updateTasksId(prevTaskListId, this.dragTasksId);
      }));
  }

  private putTaskId(currTaskListId: string, taskId: string): void {
    this.subscription.add(this.taskListService.getTaskListsById(currTaskListId).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        this.dropTasksId = data[0].tasksId;
        this.dropTasksId.push(taskId);
        this.updateTasksId(currTaskListId, this.dropTasksId);
      }));
  }

  private updateTasksId(taskListId: string, data: string[]): void {
    const taskListData: {tasksId: string[]} = {
      tasksId: [...data],
    };
    this.taskListService.updateTaskList(taskListId, taskListData)
      .catch(err => console.log(err));
  }

  private updateTask(newId: string, uId: string): void {
    const taskData: {id: string} = {
      id: newId,
    };
    this.taskService.updateTask(uId, taskData)
      .catch(err => console.log(err));
  }

  public drop(ev: any): void{
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    const taskId = data.split('-')[0];
    const prevTaskListId = data.split('-')[1];
    const content = ev.target.closest('.taskList-group');
    const newTasklistId = content.id;
    this.updateTask(newTasklistId, taskId); // обновление id таски(новое значение uid TaskList)
    // this.putTaskId(newTasklistId, taskId);
    // this.deleteTaskId(prevTaskListId, taskId);
    const taskCol = content.querySelector('.task-col');
    taskCol.appendChild(document.getElementById(taskId));
    ev.dataTransfer.clearData();
  }

  public removeFirst(src: string[], element: string): string[] {
    const index = src.indexOf(element);
    if (index === -1) { return src; }
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  public overDrag(ev: any): void {
    ev.preventDefault();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
