import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
// NG Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {WebviewDirective} from './directives/webview.directive';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {TaskListComponent} from './components/task-list/task-list.component';
import {TaskDetailComponent} from './components/task-detail/task-detail.component';
import {MaterialComponentsModule} from './material-components.module';
import {NativeDateAdapter} from '@angular/material';
import {NewTaskDialogComponent} from './components/new-task-dialog/new-task-dialog.component';
import { TaskItemComponent } from './components/task-item/task-item.component';

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
  ],
  entryComponents: [
    NewTaskDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [ElectronService, NativeDateAdapter],
  bootstrap: [AppComponent]
})
export class AppModule { }
