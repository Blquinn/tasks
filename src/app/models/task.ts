import {SubTask} from './subTask';
import {TaskList} from './taskList';

export class Task {
  taskList: TaskList;
  id: string;
  title: string;
  updated: Date;
  selfLink: string;
  position: string;
  status: string; // needsAction, completed
  completed: boolean;
  completedAt: Date;
  hidden: boolean;
  deleted: boolean;
  links: Array<TaskLink>;
  // subTasks: Array<SubTask>;
  subTasks: Array<Task>;
  dueDate?: Date;
  notes?: string;
  parent?: string; // parent task's id

  constructor (
    taskList: TaskList,
    id: string,
    title: string,
    updated: Date,
    selfLink: string,
    parent: string,
    position: string,
    status: string,
    completed: boolean,
    completedAt: Date,
    hidden: boolean,
    links: Array<TaskLink>,
    subTasks: Array<Task>,
    deleted: boolean,
    dueDate?: Date,
    notes?: string,
  ) {
    this.taskList = taskList;
    this.id = id;
    this.title = title;
    this.updated = updated;
    this.selfLink = selfLink;
    this.parent = parent;
    this.position = position;
    this.notes = notes;
    this.status = status;
    this.completed = completed;
    this.completedAt = completedAt;
    this.hidden = hidden;
    this.deleted = deleted;
    this.dueDate = dueDate;
    this.links = links;
    this.subTasks = subTasks;
  }

}

export class TaskLink {
  type: string;
  description: string;
  link: string;

  constructor(type: string, description: string, link: string) {
    this.type = type;
    this.description = description;
    this.link = link;
  }
}
