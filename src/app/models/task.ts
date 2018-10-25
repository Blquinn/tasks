import {SubTask} from './subTask';

export class Task {
  id: string;
  title: string;
  updated: Date;
  selfLink: string;
  parent?: string; // parent task's id
  position: string;
  notes?: string;
  status: string; // needsAction, completed
  completed: boolean;
  completedAt: Date;
  hidden: boolean;
  dueDate?: Date;
  links: Array<TaskLink>;
  subTasks: Array<SubTask>;

  constructor (id: string,
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
               subTasks: Array<SubTask>,
               dueDate?: Date,
               notes?: string,
  ) {
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
