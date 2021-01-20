import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskListService } from '../../services/task-list.service';
import TaskList from '../../models/task-list';
import {TaskService} from '../../services/task.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  private dragTasksId: string[];
  private dropTasksId: string[];
  public taskLists: TaskList[];
  public currentTaskList: TaskList;
  public isModal: Boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private taskListService: TaskListService,
              private taskService: TaskService, ) { }

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

  private retrieveTaskListsById(id: string): void {
    this.subscription.add(this.taskListService.getTaskLists(id).valueChanges({idField: 'id'})
      .subscribe((data: TaskList[]) => {
        const dataTaskList = data;
      }));
  }

  private deleteTaskId(prevTaskListId: string, taskId: string): void {
    this.taskListService.getTaskListsById(prevTaskListId).valueChanges({idField: 'id'})
      .pipe(
        take(1)
      ).subscribe((data: TaskList[]) => {
        const dragTasksId = this.removeFirst(data[0].tasksId, taskId);
        this.updateTasksId(prevTaskListId, dragTasksId);
     });
  }

  private putTaskId(currTaskListId: string, dragTaskId: string, value: string, currTaskId?: string): void {
    let dropTasksId;
    this.taskListService.getTaskListsById(currTaskListId).valueChanges({idField: 'id'})
      .pipe(
        take(1)
      )
     .subscribe((data: TaskList[]) => {
       if (currTaskId){
          dropTasksId = this.updateTasksIdArray(data[0].tasksId, dragTaskId, value, currTaskId);
        }
        else{
          dropTasksId = this.updateTasksIdArray(data[0].tasksId, dragTaskId, value);
        }
       this.updateTasksId(currTaskListId, dropTasksId);
       });
  }

  public updateTasksIdArray(tasksId: string[], dragTaskId: string, value: string, currTaskId?: string): string[]{
    console.log(tasksId);
    let index;
    if (currTaskId){
      index = tasksId.indexOf(currTaskId);
    }
    switch (value){
      case 'beforeElem':
        tasksId.splice(index, 0, dragTaskId);
        return [... new Set(tasksId)];
      case 'afterElem':
        tasksId.splice(index + 1, 0, dragTaskId);
        return [... new Set(tasksId)];
      case 'top':
        tasksId.unshift(dragTaskId);
        return [... new Set(tasksId)];
      case 'bottom':
        tasksId.push(dragTaskId);
        return [... new Set(tasksId)];
      default:
        tasksId.unshift(dragTaskId);
        return [... new Set(tasksId)];
    }
  }

  private updateTasksId(taskListId: string, data: string[]): Promise<void> {
    const taskListData: {tasksId: string[]} = {
      tasksId: [...data],
    };
    return this.taskListService.updateTaskList(taskListId, taskListData)
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
    const data = ev.dataTransfer.getData('text');
    const taskId = data.split('-')[0];
    const prevTaskListId = data.split('-')[1];
    const content = ev.target.closest('.taskList-group');
    const newTasklistId = content.id;
    this.deleteTaskId(prevTaskListId, taskId);
    this.updateTask(newTasklistId, taskId);
    const elem = ev.target.closest('.task-group-container');
    const dragElem = document.getElementById(taskId);
    if (elem){
      const c = elem.getBoundingClientRect();
      const scrolltop = +document.body.scrollTop + +c.top;
      const scrollbottom = +scrolltop + +elem.offsetHeight;
      if (((+scrolltop + +scrollbottom) / 2) >= ev.clientY){
        elem.before(dragElem);
        this.putTaskId(newTasklistId, taskId, 'beforeElem', elem.id);
      }
      else{
        elem.after(dragElem);
        this.putTaskId(newTasklistId, taskId, 'afterElem', elem.id);
      }
    }
    else if (ev.target.closest('.btn-add-task-container')){
      const taskCol = content.querySelector('.task-col');
      taskCol.append(dragElem);
      this.putTaskId(newTasklistId, taskId, 'bottom');
    }
    else {
      const taskCol = content.querySelector('.task-col');
      taskCol.prepend(dragElem);
      this.putTaskId(newTasklistId, taskId, 'top');
    }
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
