import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Task} from '../../models/task';
import {MatDialog} from '@angular/material';
import {NewTaskDialogComponent} from '../new-task-dialog/new-task-dialog.component';
import {NewTask} from '../../models/newTask';
import {TaskList} from '../../models/taskList';
import {GoogleTasksService} from '../../services/google-tasks.service';
import {CreateTaskDto} from '../../models/create-task-dto';
import {flatMap, map} from 'rxjs/operators';


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

  constructor(
    private dialog: MatDialog,
    private tasksService: GoogleTasksService
  ) { }

  ngOnInit() {
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '25em',
    });

    dialogRef.afterClosed().subscribe((result?: NewTask) => {
      if (result !== undefined && result !== null) {
        this.addTask(result);
      }
    });
  }

  addTask(newTask: NewTask) {
    this.tasksService.addTask(this.activeList, newTask)
      .subscribe(task => {
        this.activeList.tasks = this.activeList.tasks.concat(task);
      });
  }

  onTaskUpdated(task: Task) {
    this.tasksService.updateTask(task).subscribe(newTask => {
      const idx = this.activeList.tasks.findIndex(t => t.id === newTask.id);
      if (idx === undefined || idx === null) { return; }

      this.activeList.tasks = this.activeList.tasks.slice(0, idx)
        .concat(newTask)
        .concat(this.activeList.tasks.slice(idx + 1));
    });
  }

  onSubTaskAdded(parent: Task, child: Task) {
    parent.subTasks.push(child);
  }

  clearCompletedTasks() {
    this.tasksService.clearCompletedTasks(this.activeList).pipe(
      flatMap(_ => this.tasksService.getTasks(this.activeList))
    ).subscribe(tasks => {
      this.activeList.tasks = tasks;
    });
  }

}
