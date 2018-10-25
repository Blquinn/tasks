import {Injectable} from '@angular/core';
import {Credentials, GoogleAuthService} from './google-auth.service';
import {HttpClient} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {GoogleTaskListResponse} from '../models/googletasks/GoogleTaskList';
import {catchError, flatMap, map, tap} from 'rxjs/operators';
import {TaskList} from '../models/taskList';
import {Task} from '../models/task';
import {GoogleTask, GoogleTasksResponse} from '../models/googletasks/GoogleTasks';
import qs from 'qs';

const BASE_URL = 'https://www.googleapis.com/tasks/v1';

@Injectable({
  providedIn: 'root'
})
export class GoogleTasksService {

  private credentials?: Credentials = null;

  constructor(
    private authService: GoogleAuthService,
    private http: HttpClient) { }

  private getCredentials(): Observable<Credentials> {
    if (this.credentials === null) {
      console.log('getting credentials');
      return from(this.authService.getCredentials())
        .pipe(
          tap(credentials => {
            this.credentials = credentials;
          }),
          catchError(this.handleError<Credentials>('Get credentials', null)),
        );
    } else {
      console.log('returning credentials from memory');
      return of(this.credentials);
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`received error while performing operation: ${operation}`);
      console.error(error);
      return of(result as T);
    };
  }

  private doRequest<T>(method: string, operation: string, path: string, query?: {}): Observable<T> {
    console.log('performing request to ' + path);
    return this.getCredentials()
      .pipe(
        flatMap( creds => {
          console.log(creds);
            let url = `${BASE_URL}/${path}`;
              if (query !== null) {
                url += '?' + qs.stringify(query);
              }
            console.log(`Doing request to ${url}`);
            return this.http.request<T>(method, url, {
              headers: {
                Authorization: `${creds.token_type} ${creds.access_token}`,
              },
            });
        }),
        catchError(this.handleError(operation, null))
      );
  }

  getTaskLists(): Observable<Array<TaskList>> {
    console.log('retrieving task list');
    return this.doRequest<GoogleTaskListResponse>('GET', 'get task lists', 'users/@me/lists')
      .pipe(
        map(res => {
          return res.items.map(l => new TaskList(l.id, l.title, new Date(l.updated), l.selfLink));
        })
      );
  }

  private mapTask(taskList: TaskList, gt: GoogleTask): Task {
    const completed = gt.status === 'complete';
    const due = (gt.due === null || gt.due === undefined) ? null : new Date(gt.due);
    return new Task(
      taskList,
      gt.id, gt.title, new Date(gt.updated),
      gt.selfLink, gt.parent, gt.position, gt.status,
      completed,
      (gt.completed !== undefined && gt.completed !== null) ? new Date(gt.completed) : null,
      gt.hidden, gt.links, [], gt.deleted, due, gt.notes);
  }

  getTasks(taskList: TaskList): Observable<Array<Task>> {
    return this.doRequest<GoogleTasksResponse>('GET', 'get tasks', `lists/${taskList.id}/tasks`, {showCompleted: false})
      .pipe(
        map(res => {
          if (res.items === undefined || res.items === null) { return []; }
          return res.items.map(gt => {
            return this.mapTask(taskList, gt);
          });
        })
      );
  }

  updateTask(task: Task): Observable<Task> {
    console.log(task);
    const googleTask: Partial<GoogleTask> = {
      id: task.id,
      title: task.title,
      parent: task.parent,
      position: task.position,
      notes: task.notes,
      status: task.completed === true ? 'completed' : 'needsAction',
      due: (task.dueDate !== undefined && task.dueDate !== null) ? task.dueDate.toISOString() : null,
      completed: (task.completedAt !== undefined && task.completedAt !== null) ? task.completedAt.toISOString() : null,
      deleted: task.deleted,
      hidden: task.hidden,
      links: task.links
    };
    return this.doRequest<GoogleTask>('PATCH', 'update task', `lists/${task.taskList.id}/tasks/${task.id}`)
      .pipe(
        map(gTask => {
          return this.mapTask(task.taskList, gTask);
        })
      );
  }

}
