import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import Task from '../../models/task';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-tasks-details',
  templateUrl: './tasks-details.component.html',
  styleUrls: ['./tasks-details.component.css']
})
export class TasksDetailsComponent implements OnInit, OnChanges {

  @Input() task: Task;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentTask: Task = null;
  message: string = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentTask = { ...this.task };
  }

  updateTask(): void {
    const data = {
      ownerTask: this.currentTask.ownerTask,
      doTask: this.currentTask.doTask,
      createDate: this.currentTask.createDate,
      dueDate: this.currentTask.dueDate,
      title: this.currentTask.title,
      content: this.currentTask.content,
      order: this.currentTask.order,
      comments: this.currentTask.comments,
      attachmentTicket: this.currentTask.attachmentTicket,
    };
    this.taskService.updateTask(this.currentTask.id, data)
      .then(() => this.message = 'The board was updated successfully!')
      .catch(err => console.log(err));
  }

  deleteTask(): void {
    this.isModal.emit(true);
    this.taskService.deleteTask(this.currentTask.id)
      .then(() => {
        this.refreshList.emit();
        this.message = 'The board was updated successfully!';
      })
      .catch(err => console.log(err));
  }
}
