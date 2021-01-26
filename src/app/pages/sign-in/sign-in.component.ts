import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import firebase from 'firebase/app';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  public userForm: FormGroup;
  public errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public signIn(userEmail: string, userPassword: string): void{
    this.authService.signIn(userEmail, userPassword).then(() => {
      if (!firebase.auth().currentUser.emailVerified){
        this.errorMessage = 'Confirm your email';
      }
    }).catch((error) => {
      this.errorMessage = 'Password or email incorrect';
    });
  }

  public clearErrorMessage(): void{
    this.errorMessage = null;
  }

  public googleAuth(): void{
    this.authService.googleAuth().catch(error => {});
  }

}
