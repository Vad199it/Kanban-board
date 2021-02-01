import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import firebase from 'firebase/app';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
  public userForm: FormGroup;
  public errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public signIn(): void{
    this.authService.signIn(this.userForm.value.email.trim(), this.userForm.value.password.trim()).then(() => {
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
