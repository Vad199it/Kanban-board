import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavbarComponent} from './navbar.component';
import {User} from '../../models/user';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../services/auth.service';

;

class MockAuthService extends AuthService {

  public getUserById(): Observable<User> {
    const data: User = {
      uid: 'string',
      email: 'string',
      displayName: 'string',
      photoURL: 'string',
      emailVerified: false,
    };
    return of(data);
  }

  public signOut(): Promise<void> {
    return Promise.resolve();
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
