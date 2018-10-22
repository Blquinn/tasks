import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TaskList} from '../../models/taskList';

@Component({
  selector: 'app-delete-task-list-dialog',
  templateUrl: './delete-task-list-dialog.component.html',
  styleUrls: ['./delete-task-list-dialog.component.scss']
})
export class DeleteTaskListDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public taskList: TaskList
  ) { }

  ngOnInit() {
  }

}
