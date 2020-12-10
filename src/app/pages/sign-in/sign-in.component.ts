import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public PATH_IMG1 = '../assets/firstcassette.png';

  myForm: FormGroup;
  constructor(public authService: AuthService) {
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

  ngOnInit(): void {
  }

}
