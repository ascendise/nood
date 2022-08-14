import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousComponent } from './anonymous/anonymous.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: AnonymousComponent, canActivate: [AuthGuard], data: {requiresLogin: false, redirectTo: '/dashboard'}},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {requiresLogin: true, redirectTo: '/'}},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
