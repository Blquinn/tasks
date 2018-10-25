export class TaskList {
  id: string;
  title: string;
  updated: Date;
  selfLink: string;

  constructor(id: string, title: string, updated: Date, selfLink: string) {
    this.id = id;
    this.title = title;
    this.updated = updated;
    this.selfLink = selfLink;
  }

}
