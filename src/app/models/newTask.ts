export class NewTask {
  title: string;
  description?: string;
  dueDate?: Date;

  constructor() {
    this.title = '';
    this.description = null;
    this.dueDate = null;
  }
}
