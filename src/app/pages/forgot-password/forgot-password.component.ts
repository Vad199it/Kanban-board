import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public PATH_IMG3 = '../assets/thirdcassette.jpg';
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
