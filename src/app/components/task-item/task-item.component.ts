import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../models/task';
import {SubTask} from '../../models/subTask';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input() task: Task;

  @Output() taskCompleted: EventEmitter<Task> = new EventEmitter<Task>();

  subTaskEditField = '';

  constructor() { }

  ngOnInit() {
  }

  onTaskChecked() {
    this.taskCompleted.emit(this.task);
  }

  onSave() {
    console.log('saving');
  }

  onSubTaskKey(event: KeyboardEvent) {
    let id = -1;
    if (this.task.subTasks.length > 0) {
      id = Math.max.apply(Math, this.task.subTasks.map(t => t.id));
    }

    this.task.subTasks.push(new SubTask(id + 1, this.subTaskEditField, false));
    this.subTaskEditField = '';
  }

}
