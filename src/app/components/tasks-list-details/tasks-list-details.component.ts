import {Component, OnInit, Input, OnChanges, Output, EventEmitter, ContentChild} from '@angular/core';
import TaskList from '../../models/task-list';
import {TaskListService} from '../../services/task-list.service';

@Component({
  selector: 'app-tasks-list-details',
  templateUrl: './tasks-list-details.component.html',
  styleUrls: ['./tasks-list-details.component.css']
})
export class TasksListDetailsComponent implements OnInit, OnChanges {
  @Input() taskList: TaskList;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentTaskList: TaskList = null;
  message: string = '';

  constructor(private taskListService: TaskListService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentTaskList = { ...this.taskList };
  }

  updateTaskList(): void {
    const data = {
      title: this.currentTaskList.title,
      type: this.currentTaskList.order,
    };
    this.taskListService.updateTaskList(this.currentTaskList.id, data)
      .then(() => this.message = 'The board was updated successfully!')
      .catch(err => console.log(err));
  }

  deleteTaskList(): void {
    this.isModal.emit(true);
    this.taskListService.deleteTaskList(this.currentTaskList.id)
      .then(() => {
        this.refreshList.emit();
        this.message = 'The board was updated successfully!';
      })
      .catch(err => console.log(err));
  }
}