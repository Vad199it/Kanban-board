import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

import { AuthService } from '../../services/auth.service';
import {User} from '../../models/user';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public users: Observable<User>;
  public isActiveFont: Boolean = false;

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.users = this.authService.getUserById(this.authService.getUser().uid);
  }

  public changeActiveFont(): void {
    this.isActiveFont = !this.isActiveFont;
  }

  public signOut(): void{
    this.authService.signOut();
  }

}
