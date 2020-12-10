import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public PATH_IMG2 = '../assets/secondcassette.png';
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
