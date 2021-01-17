import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  userForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public signIn(userEmail: string, userPassword: string): void{
    this.authService.signIn(userEmail, userPassword);
  }

  public googleAuth(): void{
    this.authService.googleAuth();
  }

}
