import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './auth.guard';
import { AdminPage } from './pages/admin/admin';
import { FeedbackPage } from './pages/feedback/feedback';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  { path: 'register', component: RegisterPage, canActivate: [guestGuard] },
  { path: 'feedback', component: FeedbackPage, canActivate: [authGuard] },
  { path: 'admin', component: AdminPage, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'login' },
];
