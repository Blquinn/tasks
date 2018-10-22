import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskList} from '../../models/taskList';
import {NewTaskListComponent} from '../new-task-list/new-task-list.component';
import {MatDialog} from '@angular/material';
import {EditTaskListDialogComponent} from '../edit-task-list-dialog/edit-task-list-dialog.component';
import {DeleteTaskListDialogComponent} from '../delete-task-list-dialog/delete-task-list-dialog.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  active?: TaskList;

  @Input() taskLists: Array<TaskList>;
  @Output() activeList: EventEmitter<TaskList> = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  activateTaskList(list: TaskList) {
    this.active = list;
    this.activeList.emit(list);
  }

  addNewList(listName: string) {
    let maxID = -1;
    if (this.taskLists.length > 0) {
      maxID = Math.max.apply(Math, this.taskLists.map(tl => tl.id));
    }
    const newList = new TaskList(maxID + 1, listName);
    this.taskLists.push(newList);
    this.activateTaskList(newList);
  }

  openAddListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, {
      width: '25em',
    });

    dialogRef.afterClosed().subscribe((result?: string) => {
      if (result != null) {
        this.addNewList(result);
      }
    });
  }

  openEditTaskListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(EditTaskListDialogComponent, {
      width: '25em',
      data: list,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {

    });
  }

  openDeleteTaskListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(DeleteTaskListDialogComponent, {
      width: '25em',
      data: list,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.taskLists = this.taskLists.filter(l => l.id !== list.id);
      }
    });
  }

}
