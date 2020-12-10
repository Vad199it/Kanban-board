import {Injectable, NgZone, OnDestroy} from '@angular/core';
import { User } from '../models/user';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import {AppConst} from '../app.constants';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy{
  public userData: any; // Save logged in user data
  subscription: Subscription;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private cookieService: CookieService// NgZone service to remove outside scope warning
  ) {
    /* Saving user data in cookie when
    logged in and setting up null when logged out */
    this.subscription = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.cookieService.putObject('user', this.userData);
        this.cookieService.getObject('user');
      } else {
        this.cookieService.putObject('user', null);
        this.cookieService.getObject('user');
      }
    });
  }

  // Sign in with email/password
  signIn(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([`${AppConst.TASKS}`]);
        });
        this.setUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  signUp(name: string, email: string, password: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificationMail() function when new user sign
        up and returns promise */
        this.sendVerificationMail();
        this.setUserData(result.user, name);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verification when new user sign up
  sendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      return user.sendEmailVerification();
    }).then(() => {
      this.router.navigate([`${AppConst.VERIFY_EMAIL}`]);
    });
  }

  // Reset Forgot password
  forgotPassword(passwordResetEmail): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is logged in and email is verified
 /* get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false);
  }*/

  // Sign in with Google
  googleAuth(): Promise<void> {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  authLogin(provider: any): Promise<void> {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([`${AppConst.TASKS}`]);
        });
        this.setUserData(result.user, name);
      }).catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any, name?: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || name,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  signOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.cookieService.remove('user');
      this.router.navigate([`${AppConst.SIGN_IN}`]);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
