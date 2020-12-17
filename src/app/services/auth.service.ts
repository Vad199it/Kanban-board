import {Injectable, NgZone} from '@angular/core';
import { User } from '../models/user';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {AppConst} from '../app.constants';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private dbPath = '/users';
  private userDoc: AngularFirestoreDocument<User>;
  private user: Observable<User>;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
  ) {}

  public getUser(): any{
    return firebase.auth().currentUser;
  }
  public signIn(email: string, password: string): Promise<void> {
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

  public signUp(name: string, email: string, password: string): Promise<void> {
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

  public sendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      return user.sendEmailVerification();
    }).then(() => {
      this.router.navigate([`${AppConst.VERIFY_EMAIL}`]);
    });
  }

  public forgotPassword(passwordResetEmail): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  public googleAuth(): Promise<void> {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  public authLogin(provider: any): Promise<void> {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {

        this.ngZone.run(() => {
          this.router.navigate([`${AppConst.TASKS}`]);
        });
        this.setUserData(result.user);
      }).catch((error) => {
        window.alert(error);
      });
  }

  public setUserData(user: any, name?: string): Promise<void> {
    try {
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
    catch (err){
      console.log(err);
    }
  }

  public signOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.router.navigate([`${AppConst.SIGN_IN}`]);
    });
  }

  public getUsers(): AngularFirestoreCollection<User> {
    return this.afs.collection(this.dbPath);
  }

  public getUserById(id: string): Observable<User>{
    this.userDoc = this.afs.doc<User>(`users/${id}`);
    return this.user = this.userDoc.valueChanges();
  }

}
