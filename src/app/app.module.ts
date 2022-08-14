import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnonymousComponent } from './anonymous/anonymous.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnonymousComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
