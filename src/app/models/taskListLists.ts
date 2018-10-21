import {Task} from './task';

export class TaskListLists {
  tasks: Array<Task>;
  completedTasks: Array<Task>;

  constructor(tasks: Array<Task>, completed: Array<Task>) {
    this.tasks = tasks;
    this.completedTasks = completed;
  }
}
