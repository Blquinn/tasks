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
  parentId?: string; // parentId task's id
  parent?: Task; // parentId task's id

  constructor (
    taskList: TaskList,
    id: string,
    title: string,
    updated: Date,
    selfLink: string,
    parentId: string,
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
    parent?: Task
  ) {
    this.taskList = taskList;
    this.id = id;
    this.title = title;
    this.updated = updated;
    this.selfLink = selfLink;
    this.parentId = parentId;
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
    this.parent = parent;
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
