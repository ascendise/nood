import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnonymousComponent } from './components/anonymous/anonymous.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, DashboardComponent, AnonymousComponent, NewTaskComponent],
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
