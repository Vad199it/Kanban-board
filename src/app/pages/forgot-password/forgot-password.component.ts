import {Component, OnInit} from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  public userForm: FormGroup;
  public errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      passwordResetEmail: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  public forgotPassword(): void{
    this.authService.forgotPassword(this.userForm.value.passwordResetEmail.trim()).catch((error) => {
      this.errorMessage = error.message;
    });
  }

  public clearErrorMessage(): void{
    this.errorMessage = null;
  }
}
