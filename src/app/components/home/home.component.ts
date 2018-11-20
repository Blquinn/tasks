import {Component, OnInit} from '@angular/core';
import {TaskList} from '../../models/taskList';
import {Task} from '../../models/task';
import {TaskListLists} from '../../models/taskListLists';
import {GoogleTasksService} from '../../services/google-tasks.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  taskLists?: Array<TaskList>;
  activeList?: TaskList;
  loadingTaskList = false;
  loggedIn = false;

  constructor(private tasksService: GoogleTasksService) {
  }

  ngOnInit() {
    // try to refresh token
  }

  getTaskLists() {
    return this.tasksService.getTaskLists()
      .pipe(catchError(this.handleError('get task lists', [])))
      .subscribe(taskLists => {
        this.loggedIn = true;
        this.taskLists = taskLists;
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.loadingTaskList = false;
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  logOut() {
    this.tasksService.clearCredentials();
    this.loggedIn = false;
    this.activeList = null;
    this.taskLists = null;
  }

  onActiveList(list?: TaskList) {
    this.loadingTaskList = true;

    if (list === null) {
      this.activeList = null;
    } else {
      this.activeList = list;
      this.tasksService.getTasks(list).pipe(
        catchError(this.handleError('get tasks', []))
      ).subscribe((tasks: Array<Task>) => {
        this.loadingTaskList = false;
        list.tasks = tasks;
      });
    }
  }

}
