import {Component, OnInit} from '@angular/core';
import {TaskList} from '../../models/taskList';
import {Task} from '../../models/task';
import {SubTask} from '../../models/subTask';
import {TaskListLists} from '../../models/taskListLists';
import {GoogleAuthService} from '../../services/google-auth.service';
import {OAuth2Client} from 'google-auth-library';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  taskLists: Array<TaskList> = [
    {
      id: 0,
      name: 'Matador',
    },
    {
      id: 1,
      name: 'Personal',
    }
  ];

  activeList?: TaskList;
  activeTasks?: TaskListLists;

  // oauthClient?: OAuth2Client;

  constructor() {
  }

  ngOnInit() {
    // this.googleAuth.getOAuthClient()
    //   .then((client) => {
    //     this.oauthClient = client;
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  }

  // async getOAuthClient(): Promise<OAuth2Client> {
  //   if (this.oauthClient == null) {
  //     this.oauthClient = await this.googleAuth.getOAuthClient();
  //     return this.oauthClient;
  //   }
  //   return this.oauthClient;
  // }

  onActiveList(list: TaskList) {
    this.activeList = list;
    this.getTasks(list);
  }

  getTasks(list: TaskList) {
    let tasks: TaskListLists;
    if (list.name === this.taskLists[0].name) {
      tasks = new TaskListLists([
        new Task(0, 'Do Homework', null, false, null, [
          new SubTask(0, 'Do math', false),
          new SubTask(1, 'Do english', false)
        ]),
        new Task(1, 'Get a costume',
          `Go to a store somewhere and buy a costume, I mean how long of a description could you realy write about this topic?`,
          false, new Date(), []),
        new Task(2, 'FooBar', null, false, null, []),
      ], []);
    } else if (list.name === this.taskLists[1].name) {
      tasks = new TaskListLists([
        new Task(0, 'Do Personal thing', null, false, null, [
          new SubTask(0, 'Do math', false),
          new SubTask(1, 'Do english', false)
        ]),
      ], [
        new Task(1, 'DO some other personal thing',
          `Go to a store somewhere and buy a costume, I mean how long of a description could you realy write about this topic?`,
          true, new Date(), [
            new SubTask(0, 'Do something', false),
          ]),
        new Task(2, 'FooBar', null, true, null, []),
      ]);

    } else {
      tasks = new TaskListLists([], []);
    }
    this.activeTasks = tasks;
  }

}
