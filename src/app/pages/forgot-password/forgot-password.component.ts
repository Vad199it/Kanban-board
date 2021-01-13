import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService) { }

  public forgotPassword(passwordResetEmail: string): void{
    this.authService.forgotPassword(passwordResetEmail);
  }
}
