import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousComponent } from './components/anonymous/anonymous.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewTaskComponent } from './components/task/new-task/new-task.component';
import { TaskDetailsComponent } from './components/task/task-details/task-details.component';
import { EditTaskComponent } from './components/task/edit-task/edit-task.component';

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
  {
    path: 'edit-task',
    component: EditTaskComponent,
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
