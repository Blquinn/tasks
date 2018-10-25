import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../../models/task';

@Component({
  selector: 'app-completed-task-item',
  templateUrl: './completed-task-item.component.html',
  styleUrls: ['./completed-task-item.component.scss']
})
export class CompletedTaskItemComponent implements OnInit {

  @Input() task: Task;

  constructor() { }

  ngOnInit() {
  }

}
