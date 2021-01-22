import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public userForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, { validator: passwordMatchValidator});
  }

  public signUp(username: string, userEmail: string, userPassword: string): void{
    this.authService.signUp(username, userEmail, userPassword);
  }

  public googleAuth(): void{
    this.authService.googleAuth();
  }
}

function passwordMatchValidator(frm: FormGroup): {mismatch: boolean} {
  return frm.controls.password.value ===
  frm.controls.confirmPassword.value ? null : {mismatch: true};
}
