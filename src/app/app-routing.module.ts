import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousComponent } from './components/anonymous/anonymous.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';

const routes: Routes = [
  {
    path: '',
    component: AnonymousComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: false, redirectTo: '/dashboard' },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/' },
  },
  {
    path: 'new-task',
    component: NewTaskComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/'},
  },
  {
    path: 'task-details',
    component: TaskDetailsComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/'},
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
