import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {canActivate, emailVerified, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {pipe} from 'rxjs';
import {map} from 'rxjs/operators';

const redirectUnverifiedTo = (redirect: any[]) => pipe(emailVerified, map(emailVerified => emailVerified || redirect));
const redirectUnauthorizedToEmail = () => redirectUnverifiedTo(['sign-in']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module')
      .then(m => m.SignInModule)},
  { path: 'sign-up', loadChildren: () => import('./pages/sign-up/sign-up.module')
      .then(m => m.SignUpModule), },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgot-password/forgot-password.module')
      .then(m => m.ForgotPasswordModule) },
  { path: 'verify-email', loadChildren: () => import('./pages/verify-email/verify-email.module')
      .then(m => m.VerifyEmailModule), ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module')
      .then(m => m.DashboardModule), ...canActivate(redirectUnauthorizedToEmail) },
  { path: 'board/:uid', loadChildren: () => import('./pages/board/board.module')
      .then(m => m.BoardModule), ...canActivate(redirectUnauthorizedToEmail) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
