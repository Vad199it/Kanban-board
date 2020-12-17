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
    this.task.idTicket = (this.generationKey(this.task.title).toString()).substr(0, 6);
    console.log(this.task.idTicket);
    this.taskService.createTask(this.task).then(() => {
      console.log('Created new board successfully!');
      this.submitted = false;
    });
  }
  newTask(): void {
    this.submitted = true;
    this.task = new Task();
  }

  generationKey(str: string): number {
    let hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

}
