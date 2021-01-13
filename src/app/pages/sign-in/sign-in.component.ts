import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  myForm: FormGroup;
  constructor(private authService: AuthService) {
    /* this.myForm = new FormGroup({

      'userName': new FormControl('Tom', Validators.required),
      'userEmail': new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      'userPhone': new FormControl('', Validators.pattern('[0-9]{10}'))
    });*/
  }

  /*submit(){
    console.log(this.myForm);
  }*/

  public signIn(userEmail: string, userPassword: string): void{
    this.authService.signIn(userEmail, userPassword);
  }

  public googleAuth(): void{
    this.authService.googleAuth();
  }

}
