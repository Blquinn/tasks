import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-task-list',
  templateUrl: './new-task-list.component.html',
  styleUrls: ['./new-task-list.component.scss']
})
export class NewTaskListComponent implements OnInit {

  newList = '';

  constructor(
    public dialogRef: MatDialogRef<NewTaskListComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    if (this.newList.length <= 0) {
      this.dialogRef.close(null);
    } else {
      this.dialogRef.close(this.newList);
    }
  }

}
