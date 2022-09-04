import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnonymousComponent } from './components/anonymous/anonymous.component';
import { NewTaskComponent } from './components/task/new-task/new-task.component';
import { FormsModule } from '@angular/forms';
import { NotInPastDirective } from './validators/not-in-past/not-in-past.directive';
import { TaskDetailsComponent } from './components/task/task-details/task-details.component';
import { EditTaskComponent } from './components/task/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnonymousComponent,
    NewTaskComponent,
    NotInPastDirective,
    TaskDetailsComponent,
    EditTaskComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, OAuthModule.forRoot(), FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
