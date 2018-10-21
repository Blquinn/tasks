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

  // tasks = [
  //   new Task(0, 'Do Homework', null, false, null, [
  //     new SubTask(0, 'Do math', false),
  //     new SubTask(1, 'Do english', false)
  //   ]),
  //   new Task(1, 'Get a costume',
  //     `Go to a store somewhere and buy a costume, I mean how long of a description could you realy write about this topic?`,
  //     false, new Date(), []),
  //   new Task(2, 'FooBar', null, false, null, []),
  // ];
  //
  // completedTasks: Array<Task> = [
  //   new Task(3, 'Other foo', null, false, null, []),
  // ];

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
    this.activeList.tasks.push(new Task(maxTaskID + 1, newTask.title, newTask.description, false, newTask.dueDate, []));
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
