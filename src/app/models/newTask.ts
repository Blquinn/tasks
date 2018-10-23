export class NewTask {
  title: string;
  notes?: string;
  dueDate?: Date;

  constructor() {
    this.title = '';
    this.notes = null;
    this.dueDate = null;
  }
}
