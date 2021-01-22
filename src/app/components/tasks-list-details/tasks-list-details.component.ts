import {Component, Input, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';

import TaskList from '../../models/task-list';
import {TaskListService} from '../../services/task-list.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-tasks-list-details',
  templateUrl: './tasks-list-details.component.html',
  styleUrls: ['./tasks-list-details.component.scss']
})
export class TasksListDetailsComponent implements OnChanges {
  @Input() boardId: string;
  @Input() taskList: TaskList;
  @Output() isModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  public currentTaskList: TaskList;
  public isFinalList: boolean;
  public taskListForm: FormGroup;

  constructor(private taskListService: TaskListService,
              private formBuilder: FormBuilder) {
    this.taskListForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskList && changes.taskList.currentValue) {
      this.currentTaskList = {...this.taskList};
    }
  }

  public updateTaskList(): void {
    const data: {title: string, isFinalList: boolean} = {
      title: this.currentTaskList.title,
      isFinalList: this.currentTaskList.isFinalList,
    };
    this.taskListService.updateTaskList(this.currentTaskList.id, data)
      .then(() => {
        this.isModal.emit(true);
      })
      .catch(err => console.log(err));
  }

  public deleteTaskList(): void {
    this.isModal.emit(true);
    this.taskListService.deleteTaskList(this.currentTaskList.id, this.boardId)
      .then(() => {
        this.refreshList.emit();
      })
      .catch(err => console.log(err));
  }
}
