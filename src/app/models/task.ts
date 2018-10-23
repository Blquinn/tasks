import {SubTask} from './subTask';

export class Task {
  id: number;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: Date;
  subTasks: Array<SubTask>;

  constructor (id: number, title: string, notes: string, completed: boolean, dueDate: Date,
               subTasks: Array<SubTask>) {
    this.id = id;
    this.title = title;
    this.notes = notes;
    this.completed = completed;
    this.dueDate = dueDate;
    this.subTasks = subTasks;
  }

}
