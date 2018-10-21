import {SubTask} from './subTask';

export class Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  subTasks: Array<SubTask>;

  constructor (id: number, title: string, description: string, completed: boolean, dueDate: Date,
               subTasks: Array<SubTask>) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.dueDate = dueDate;
    this.subTasks = subTasks;
  }

  shortDescription(): string {
    if (this.description) {
      return this.description.slice(0, 30) + '...';
    }
    return '';
  }

}
