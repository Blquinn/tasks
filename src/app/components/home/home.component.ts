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

  taskLists: Array<TaskList>;

  activeList?: TaskList;
  activeTasks?: TaskListLists;

  constructor(private tasks: GoogleTasksService) {
  }


  ngOnInit() {
    this.tasks.getTaskLists()
      .pipe(catchError(this.handleError('get task lists', [])))
      .subscribe((tasks: Array<TaskList>) => {
        this.taskLists = tasks;
      });
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
      this.tasks.getTasks(list.id).pipe(
        catchError(this.handleError('get tasks', []))
      ).subscribe((tasks: Array<Task>) => {
        this.activeTasks = new TaskListLists(
          tasks.filter(t => t.completed === false),
          tasks.filter(t => t.completed === true),
        );
      });
    }
  }

}
