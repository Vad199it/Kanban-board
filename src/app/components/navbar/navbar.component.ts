import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import {Observable} from 'rxjs';
import {User} from '../../models/user';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  users: Observable<User>;
  public isActiveFont: boolean = false;
  displayName: any;

  public userImg = '.../../../assets/person-icon.png';
  public profileImg = '../../../assets/user.png';
  public logoutImg = '../../../assets/log-out.png';

  constructor(public authService: AuthService,
              public router: Router,
              public ngZone: NgZone) { }

  ngOnInit(): void {
    this.users = this.authService.getUserById(this.authService.getUser().uid);
  }

   public changeActiveFont(): void {
     this.isActiveFont = !this.isActiveFont;
  }

}
