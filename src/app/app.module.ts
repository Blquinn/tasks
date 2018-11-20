import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
// NG Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {WebviewDirective} from './directives/webview.directive';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {CompletedTasksPipe, IncompleteTasksPipe, TaskListComponent} from './components/task-list/task-list.component';
import {TaskDetailComponent} from './components/task-detail/task-detail.component';
import {MaterialComponentsModule} from './material-components.module';
import {
  MAT_DIALOG_DATA,
  MAT_SNACK_BAR_DEFAULT_OPTIONS, MatCardModule,
  MatDialogRef,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  NativeDateAdapter
} from '@angular/material';
import {NewTaskDialogComponent} from './components/new-task-dialog/new-task-dialog.component';
import {TaskItemComponent} from './components/task-item/task-item.component';
import {NewTaskListComponent} from './components/new-task-list/new-task-list.component';
import {DeleteTaskListDialogComponent} from './components/delete-task-list-dialog/delete-task-list-dialog.component';
import {EditTaskListDialogComponent} from './components/edit-task-list-dialog/edit-task-list-dialog.component';
import {CompletedTaskItemComponent} from './components/completed-task-item/completed-task-item.component';
import {AuthInterceptor} from './services/auth-interceptor';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    SideBarComponent,
    TaskListComponent,
    TaskDetailComponent,
    NewTaskDialogComponent,
    TaskItemComponent,
    NewTaskListComponent,
    DeleteTaskListDialogComponent,
    EditTaskListDialogComponent,
    CompletedTaskItemComponent,
    CompletedTasksPipe,
    IncompleteTasksPipe,
  ],
  entryComponents: [
    NewTaskDialogComponent,
    NewTaskListComponent,
    DeleteTaskListDialogComponent,
    EditTaskListDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialComponentsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    ElectronService,
    NativeDateAdapter,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
