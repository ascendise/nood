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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskDetailsComponent } from './components/task/task-details/task-details.component';
import { EditTaskComponent } from './components/task/edit-task/edit-task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewChecklistComponent } from './components/checklist/new-checklist/new-checklist.component';
import { FormComponent } from './components/form/form.component';
import { ChecklistComponent } from './components/dashboard/checklist/checklist.component';
import { SelectListComponent } from './components/select-list/select-list.component';
import { SelectOptionComponent } from './components/select-list/select-option/select-option.component';
import { EditChecklistComponent } from './components/checklist/edit-checklist/edit-checklist.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnonymousComponent,
    NewTaskComponent,
    TaskDetailsComponent,
    EditTaskComponent,
    NewChecklistComponent,
    FormComponent,
    ChecklistComponent,
    SelectListComponent,
    SelectOptionComponent,
    EditChecklistComponent,
    ConfirmDialogComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
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
