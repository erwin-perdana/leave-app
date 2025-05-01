import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { authGuard } from './guards/auth.guards';
import { AdminFormComponent } from './pages/admin/admin-form/admin-form.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EmployeeComponent } from './pages/employee/employee/employee.component';
import { EmployeeFormComponent } from './pages/employee/employee-form/employee-form.component';
import { LeaveComponent } from './pages/leave/leave/leave.component';
import { LeaveFormComponent } from './pages/leave/leave-form/leave-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { 
      path: 'login',
      data: { isLogout: true },
      loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) 
    },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], pathMatch: 'prefix' },
    { path: 'admin/new', component: AdminFormComponent, canActivate: [authGuard], pathMatch: 'prefix' },
    { path: 'admin/edit/:id', component: AdminFormComponent, canActivate: [authGuard], pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'employee', component: EmployeeComponent, canActivate: [authGuard], pathMatch: 'prefix' },
    { path: 'employee/new', component: EmployeeFormComponent, canActivate: [authGuard], pathMatch: 'prefix' },
    { path: 'employee/edit/:id', component: EmployeeFormComponent, canActivate: [authGuard], pathMatch: 'full' },
    { path: 'employees/:employeeId/leaves', component: LeaveComponent, canActivate: [authGuard], pathMatch: 'prefix' },
    { path: 'employees/:employeeId/leaves/new', component: LeaveFormComponent, canActivate: [authGuard], pathMatch: 'prefix' },
    { path: 'employees/:employeeId/leaves/edit/:id', component: LeaveFormComponent, canActivate: [authGuard], pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
