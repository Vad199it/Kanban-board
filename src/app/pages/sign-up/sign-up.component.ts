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
  public errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, { validator: passwordMatchValidator});
  }

  public signUp(username: string, userEmail: string, userPassword: string): void{
    this.authService.signUp(username, userEmail, userPassword).catch((error) => {
      this.errorMessage = error.message;
    });
  }

  public googleAuth(): void{
    this.authService.googleAuth().catch(error => {});
  }

  public clearErrorMessage(): void{
    this.errorMessage = null;
  }
}

function passwordMatchValidator(frm: FormGroup): {mismatch: boolean} {
  return frm.controls.password.value ===
  frm.controls.confirmPassword.value ? null : {mismatch: true};
}
