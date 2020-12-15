import {Component, Input, OnInit} from '@angular/core';

import Task from '../../models/task';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.css']
})
export class TasksBoardComponent implements OnInit {
  @Input() taskListId: string;
  task: Task;
  public submitted: boolean = false;
  public addBoardImg = '../../../assets/add-board.png';
  id: string;
  constructor(private taskService: TaskService,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  saveTask(): void {
    this.task.id = this.taskListId;
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
