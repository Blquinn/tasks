import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../models/task';
import {SubTask} from '../../models/subTask';
import {GoogleTasksService} from '../../services/google-tasks.service';
import {NewTaskDialogComponent} from '../new-task-dialog/new-task-dialog.component';
import {NewTask} from '../../models/newTask';
import {MatDialog} from '@angular/material';
import {flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input() task: Task;

  @Output() taskUpdated: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() subTaskAdded: EventEmitter<Task> = new EventEmitter<Task>();

  // subTaskEditField = '';

  constructor(
    private googleTasks: GoogleTasksService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '25em',
      data: {
        parentId: this.task.id
      }
    });

    dialogRef.afterClosed().pipe(
      flatMap((result?: NewTask) => {
        if (result === null) {
          return null;
        }
        return this.googleTasks.addTask(this.task.taskList, result);
      })
    ).subscribe((task?: Task) => {
      this.subTaskAdded.emit(task);
    });
  }

  onTaskChecked() {
    this.task.completed = true;
    this.save();
  }

  save() {
    this.googleTasks.updateTask(this.task)
      .subscribe(t => {
        this.taskUpdated.emit(this.task);
      });
  }

  onAddSubTask() {

  }

}
