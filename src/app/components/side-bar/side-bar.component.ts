import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskList} from '../../models/taskList';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  active?: TaskList;

  @Input() taskLists: Array<TaskList>;
  @Output() activeList: EventEmitter<TaskList> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  activateTaskList(list: TaskList) {
    this.active = list;
    this.activeList.emit(list);
  }

}
