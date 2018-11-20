import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewTask} from '../../models/newTask';

export interface INewTaskInput {
  parentId?: string;
}

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.scss']
})
export class NewTaskDialogComponent implements OnInit {

  newTask: NewTask;

  constructor(
    public dialogRef: MatDialogRef<NewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: INewTaskInput
  ) {
    this.newTask = {
      title: '',
      parent: data === null ? null : data.parentId,
    };
  }

  ngOnInit() {
  }

  closeDialog() {
    if (this.newTask.title === '') {
      this.dialogRef.close();
    } else {
      this.dialogRef.close(this.newTask);
    }
  }

}
