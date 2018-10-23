import {Component, OnInit} from '@angular/core';
import {TaskList} from '../../models/taskList';
import {Task} from '../../models/task';
import {SubTask} from '../../models/subTask';
import {TaskListLists} from '../../models/taskListLists';
import {GoogleTasksService} from '../../services/google-tasks.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

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

  constructor(private tasks: GoogleTasksService) {
  }


  ngOnInit() {
    this.tasks.getTaskLists()
      .pipe(
        tap(tasks => {
          console.log('recv task list');
          console.log(tasks.map(t => new TaskList(0, t.title)));
        }),
        catchError(this.handleError('get task lists', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  onActiveList(list?: TaskList) {
    if (list === null) {
      this.activeList = null;
      this.activeTasks = null;
    } else {
      this.activeList = list;
      this.getTasks(list);
    }
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
          new SubTask(0, 'Do math', true),
          new SubTask(1, 'Do english', false)
        ]),
      ], [
        new Task(1, 'DO some other personal thing',
          `Go to a store somewhere and buy a costume, I mean how long of a description could you realy write about this topic?`,
          true, new Date(), [
            new SubTask(0, 'Do something', true),
            new SubTask(1, 'Do something else', false),
          ]),
        new Task(2, 'FooBar', null, true, null, []),
      ]);

    } else {
      tasks = new TaskListLists([], []);
    }
    this.activeTasks = tasks;
  }

}
