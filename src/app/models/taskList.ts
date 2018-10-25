import {Task} from './task';

export class TaskList {
  id: string;
  title: string;
  updated: Date;
  selfLink: string;
  tasks?: Array<Task>;

  constructor(id: string, title: string, updated: Date, selfLink: string, tasks?: Array<Task>) {
    this.id = id;
    this.title = title;
    this.updated = updated;
    this.selfLink = selfLink;
    this.tasks = tasks;
  }

}
