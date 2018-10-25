import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Task} from '../../models/task';
import {MatDialog} from '@angular/material';
import {NewTaskDialogComponent} from '../new-task-dialog/new-task-dialog.component';
import {NewTask} from '../../models/newTask';
import {TaskList} from '../../models/taskList';


@Pipe({name: 'completedTaskPipe'})
export class CompletedTasksPipe implements PipeTransform {
  transform(tasks: Array<Task>) {
    return tasks.filter(t => t.completed === true);
  }
}

@Pipe({name: 'incompleteTaskPipe'})
export class IncompleteTasksPipe implements PipeTransform {
  transform(tasks: Array<Task>) {
    return tasks.filter(t => t.completed === false);
  }
}


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {

  @Input() activeList: TaskList;

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
    // let maxTaskID: number;
    // if (this.activeList.tasks.length === 0) {
    //   maxTaskID = -1;
    // } else {
    //   maxTaskID = Math.max.apply(Math, this.activeList.tasks.concat(this.activeList.completedTasks).map(t => t.id));
    // }
    // this.activeList.tasks.push(new Task(maxTaskID + 1, newTask.title, newTask.notes, false, newTask.dueDate, []));
    // this.activeList.tasks.push(new Task(maxTaskID + 1, newTask.title, newTask.notes, false, newTask.dueDate, []));
  }

  onTaskCompleted(task: Task) {
    task.completed = true;
  }

  onDeleteBtn(taskID: string) {
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
