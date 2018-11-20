import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskList} from '../../models/taskList';
import {NewTaskListComponent} from '../new-task-list/new-task-list.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {EditTaskListDialogComponent} from '../edit-task-list-dialog/edit-task-list-dialog.component';
import {DeleteTaskListDialogComponent} from '../delete-task-list-dialog/delete-task-list-dialog.component';
import {GoogleTasksService} from '../../services/google-tasks.service';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  active?: TaskList;

  @Input() taskLists: Array<TaskList>;
  @Output() activeList: EventEmitter<TaskList> = new EventEmitter();

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private googleTasks: GoogleTasksService) { }

  ngOnInit() {
  }

  activateTaskList(list?: TaskList) {
    this.active = list;
    this.activeList.emit(list);
  }

  addNewList(listName: string) {
    this.googleTasks.createTaskList(listName)
      .subscribe(taskList => {
        this.taskLists = this.taskLists.concat(taskList);
      });
  }

  updateList(taskList: TaskList) {
    this.googleTasks.updateTaskList(taskList)
      .subscribe(updatedList => {
        const i = this.taskLists.findIndex(l => l.id === updatedList.id);
        if (i === -1) {
          this.taskLists.push(taskList);
        } else {
          this.taskLists[i] = updatedList;
        }
      });
  }

  openAddListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, {
      width: '25em',
    });

    dialogRef.afterClosed().subscribe((result?: string) => {
      if (result !== undefined && result !== null) {
        this.addNewList(result);
      }
    });
  }

  openEditTaskListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(EditTaskListDialogComponent, {
      width: '25em',
      data: list,
    });

    dialogRef.afterClosed().subscribe((taskList?: TaskList) => {
      if (taskList !== null && taskList !== undefined) {
        this.googleTasks.updateTaskList(taskList)
          .subscribe(updatedList => {
            const i = this.taskLists.findIndex(l => l.id === updatedList.id);
            if (i === -1) {
              this.taskLists.push(updatedList);
            } else {
              this.taskLists[i] = updatedList;
            }

            this.snackBar.open('Saved task list');
          });
      }
    });
  }

  openDeleteTaskListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(DeleteTaskListDialogComponent, {
      width: '25em',
      data: list,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.googleTasks.deleteTaskList(list).subscribe(_ => {
          this.taskLists = this.taskLists.filter(l => l.id !== list.id);

          if (this.taskLists.length > 0) {
            this.activateTaskList(this.taskLists[0]);
          } else {
            this.activateTaskList(null);
          }
        });
      }
    });
  }

}
