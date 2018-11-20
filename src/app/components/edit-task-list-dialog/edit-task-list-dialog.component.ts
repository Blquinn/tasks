import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TaskList} from '../../models/taskList';

@Component({
  selector: 'app-edit-task-list-dialog',
  templateUrl: './edit-task-list-dialog.component.html',
  styleUrls: ['./edit-task-list-dialog.component.scss']
})
export class EditTaskListDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public taskList: TaskList,
    public dialogRef: MatDialogRef<EditTaskListDialogComponent>
  ) { }

  ngOnInit() {
  }

  onSave() {
    return this.dialogRef.close(this.taskList);
  }

}
