import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor(private authService: AuthService) { }

  public signUp(username: string, userEmail: string, userPassword: string): void{
    this.authService.signUp(username, userEmail, userPassword);
  }

  public googleAuth(): void{
    this.authService.googleAuth();
  }
}
