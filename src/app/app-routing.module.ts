import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToDashBoard = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module')
      .then(m => m.SignInModule), ...canActivate(redirectLoggedInToDashBoard) },
  { path: 'sign-up', loadChildren: () => import('./pages/sign-up/sign-up.module')
      .then(m => m.SignUpModule), },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgot-password/forgot-password.module')
      .then(m => m.ForgotPasswordModule) },
  { path: 'verify-email', loadChildren: () => import('./pages/verify-email/verify-email.module')
      .then(m => m.VerifyEmailModule), ...canActivate(redirectUnauthorizedToLogin)  },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module')
      .then(m => m.DashboardModule), ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'board/:uid', loadChildren: () => import('./pages/board/board.module')
      .then(m => m.BoardModule), ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
