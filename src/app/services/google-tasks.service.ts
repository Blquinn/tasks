import {Injectable} from '@angular/core';
import {Credentials, GoogleAuthService} from './google-auth.service';
import {HttpClient} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {GoogleTaskList, GoogleTaskListResponse} from '../models/googletasks/GoogleTaskList';
import {catchError, flatMap, map, take, tap} from 'rxjs/operators';
import {TaskList} from '../models/taskList';
import {Task} from '../models/task';
import {GoogleTask, GoogleTasksResponse} from '../models/googletasks/GoogleTasks';
import qs from 'qs';
import {CreateTaskDto} from '../models/create-task-dto';
import {NewTask} from '../models/newTask';
import {MatSnackBar} from '@angular/material';

const BASE_URL = 'https://www.googleapis.com/tasks/v1';

@Injectable({
  providedIn: 'root'
})
export class GoogleTasksService {

  private credentials?: Credentials = null;

  constructor(
    private authService: GoogleAuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

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
      this.snackBar.open(`Failed to ${operation}`);
      return of(result as T);
    };
  }

  private doRequest<T>(method: string, operation: string, path: string, query?: {}, body?: any): Observable<T> {
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
                'Content-Type': 'application/json',
              },
              body: body
            });
        }),
        catchError(this.handleError(operation, null))
      );
  }

  clearCredentials() {
    localStorage.removeItem('credentials');
    this.credentials = null;
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

  createTaskList(taskListTitle: string): Observable<TaskList> {
    console.log('creating new task list');
    return this.doRequest<GoogleTaskList>('POST', 'create task list', 'users/@me/lists', null, {
      title: taskListTitle
    })
      .pipe(
        map(l => new TaskList(l.id, l.title, new Date(l.updated), l.selfLink))
      );
  }

  updateTaskList(taskList: TaskList): Observable<TaskList> {
    const googleTaskList: Partial<GoogleTaskList> = {
      title: taskList.title,
    };
    console.log('updating new task list');
    return this.doRequest<GoogleTaskList>('PATCH', 'update task list', `users/@me/lists/${taskList.id}`, null, googleTaskList)
      .pipe(
        map(l => new TaskList(l.id, l.title, new Date(l.updated), l.selfLink))
      );
  }

  deleteTaskList(taskList: TaskList): Observable<void> {
    console.log('deleting task list');
    return this.doRequest<void>('DELETE', 'delete task list', `users/@me/lists/${taskList.id}`);
  }

  clearCompletedTasks(taskList: TaskList): Observable<void> {
    console.log('clearing task list');
    return this.doRequest<void>('POST', 'clear completed tasks', `lists/${taskList.id}/clear`)
      .pipe(
        catchError(this.handleError('clear task list', null))
      );
  }

  private mapTask(taskList: TaskList, gt: GoogleTask): Task {
    const completed = gt.status === 'completed';
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
    return this.doRequest<GoogleTasksResponse>('GET', 'get tasks', `lists/${taskList.id}/tasks`)
      .pipe(
        map(res => {
          if (res === null || res.items === undefined || res.items === null) { return []; }
          const tasks = res.items.map(gt => this.mapTask(taskList, gt));
          console.log(tasks);
          return this.buildTasksTree(tasks);
        })
      );
  }

  buildTasksTree(tasks: Array<Task>): Array<Task> {
    const taskMap = tasks.reduce((m, obj) => {
      m[obj.id] = obj;
      return m;
    }, {});

    tasks.forEach(t => {
      const proposedParent: Task = taskMap[t.parentId];
      if (proposedParent !== undefined) {
        t.parent = proposedParent;
        proposedParent.subTasks.push(t);
      }
    });

    return Object.keys(taskMap)
      .map(key => taskMap[key])
      .filter(t => t.parent === undefined || t.parent === null);
  }

  updateTask(task: Task): Observable<Task> {
    const googleTask: Partial<GoogleTask> = {
      id: task.id,
      title: task.title,
      parent: task.parentId,
      position: task.position,
      notes: task.notes,
      status: task.completed === true ? 'completed' : 'needsAction',
      due: (task.dueDate !== undefined && task.dueDate !== null) ? task.dueDate.toISOString() : null,
      completed: (task.completedAt !== undefined && task.completedAt !== null) ? task.completedAt.toISOString() : null,
      deleted: task.deleted,
      hidden: task.hidden,
      links: task.links
    };
    return this.doRequest<GoogleTask>('PATCH', 'update task', `lists/${task.taskList.id}/tasks/${task.id}`, null, googleTask)
      .pipe(
        map(gTask => {
          return this.mapTask(task.taskList, gTask);
        })
      );
  }

  addTask(taskList: TaskList, newTask: NewTask): Observable<Task> {
    const taskDTO: CreateTaskDto = {
      title: newTask.title,
      parent: newTask.parent,
      notes: newTask.notes,
      due: (newTask.dueDate === undefined || newTask.dueDate === null) ? null : newTask.dueDate.toISOString(),
      links: newTask.links,
    };
    const query = taskDTO.parent === null ? {} : {parent: taskDTO.parent};
    return this.doRequest<GoogleTask>('POST', 'insert task',
      `lists/${taskList.id}/tasks/`, query, taskDTO).pipe(
      map(gtask => this.mapTask(taskList, gtask)
      )
    );
  }

}
