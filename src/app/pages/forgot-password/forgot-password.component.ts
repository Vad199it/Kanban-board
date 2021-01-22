import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public userForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      passwordResetEmail: ['', [Validators.required, Validators.email]]
    });
  }

  public forgotPassword(passwordResetEmail: string): void{
    this.authService.forgotPassword(passwordResetEmail);
  }
}
