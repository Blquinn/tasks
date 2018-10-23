import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../../models/task';
import {MatDialog} from '@angular/material';
import {NewTaskDialogComponent} from '../new-task-dialog/new-task-dialog.component';
import {NewTask} from '../../models/newTask';
import {TaskListLists} from '../../models/taskListLists';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {

  @Input() activeList: TaskListLists;

  editingTask?: Task;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '25em',
    });

    dialogRef.afterClosed().subscribe((result?: NewTask) => {
      console.log(result);
      if (result != null) {
        this.addTask(result);
      }
    });
  }

  addTask(newTask: NewTask) {
    let maxTaskID: number;
    if (this.activeList.tasks.length === 0) {
      maxTaskID = -1;
    } else {
      maxTaskID = Math.max.apply(Math, this.activeList.tasks.concat(this.activeList.completedTasks).map(t => t.id));
    }
    this.activeList.tasks.push(new Task(maxTaskID + 1, newTask.title, newTask.notes, false, newTask.dueDate, []));
  }

  onTaskCompleted(task: Task) {
    this.activeList.tasks = this.activeList.tasks.filter(t => t.id !== task.id);
    this.activeList.completedTasks.push(task);
  }

  onDeleteBtn(taskID: number) {
    this.activeList.tasks = this.activeList.tasks.filter(t => t.id !== taskID);
  }

  onEditBtn(task: Task) {
    if (this.editingTask && task.id === this.editingTask.id) {
      this.editingTask = null;
      return;
    }
    this.editingTask = task;
  }

}
