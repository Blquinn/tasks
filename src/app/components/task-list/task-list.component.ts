import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasks = ['Do homework', 'Get a costume', 'FooBar', 'Other Foo'];
  newTaskValue = '';

  constructor() { }

  ngOnInit() {
  }

  addTask(task: string) {
    if (task) {
      this.tasks.push(task);
    }
    this.newTaskValue = '';
  }

}
