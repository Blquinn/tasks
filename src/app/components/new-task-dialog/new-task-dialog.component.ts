import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Task} from '../../models/task';
import {NewTask} from '../../models/newTask';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.scss']
})
export class NewTaskDialogComponent implements OnInit {

  newTask: NewTask;

  constructor(
    public dialogRef: MatDialogRef<NewTaskDialogComponent>
  ) {
    this.newTask = new NewTask();
  }

  ngOnInit() {
  }

  closeDialog() {
    if (this.newTask.title === '') {
      this.dialogRef.close(null);
    } else {
      this.dialogRef.close(this.newTask);
    }
  }

}
