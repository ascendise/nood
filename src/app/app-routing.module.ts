import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousComponent } from './components/anonymous/anonymous.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewTaskComponent } from './components/task/new-task/new-task.component';
import { TaskDetailsComponent } from './components/task/task-details/task-details.component';
import { EditTaskComponent } from './components/task/edit-task/edit-task.component';
import { NewChecklistComponent } from './components/checklist/new-checklist/new-checklist.component';
import { EditChecklistComponent } from './components/checklist/edit-checklist/edit-checklist.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: AnonymousComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: false, redirectTo: '/dashboard', animation: 'home' },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'dashboard' },
  },
  {
    path: 'new-task',
    component: NewTaskComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'new-task' },
  },
  {
    path: 'task-details',
    component: TaskDetailsComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'task-details' },
  },
  {
    path: 'edit-task',
    component: EditTaskComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'edit-task' },
  },
  {
    path: 'new-checklist',
    component: NewChecklistComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'new-checklist' },
  },
  {
    path: 'edit-checklist',
    component: EditChecklistComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'edit-checklist' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, redirectTo: '/', animation: 'profile' },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
