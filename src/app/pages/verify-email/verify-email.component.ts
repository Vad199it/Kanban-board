import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {

  constructor(private authService: AuthService) { }

  public getUser(): any {
    return this.authService.getUser();
  }

  public sendVerificationMail(): void {
    this.authService.sendVerificationMail().catch((err) => {});
  }

}
