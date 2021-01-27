import {Injectable, NgZone} from '@angular/core';
import {User} from '../models/user';
import firebase from 'firebase/app';
import 'firebase/auth';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AppConst} from '../app.constants';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly dbPath: string = '/users';
  private userDoc: AngularFirestoreDocument<User>;
  private user: Observable<User>;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone,
  ) {
  }

  public getUser(): any {
    return firebase.auth().currentUser;
  }

  public signIn(email: string, password: string): Promise<void> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([`${AppConst.TASKS}`]);
        });
        this.setUserData(result.user);
      });
  }

  public signUp(name: string, email: string, password: string): Promise<void> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail().catch(err => console.log(err));
        this.setUserData(result.user, name).catch(err => console.log(err));
      });
  }

  public sendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      return user.sendEmailVerification();
    }).then(() => {
      this.router.navigate([`${AppConst.VERIFY_EMAIL}`]);
    }).catch(err => console.log(err));
  }

  public forgotPassword(passwordResetEmail: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
      });
  }

  public googleAuth(): Promise<void> {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  public authLogin(provider: any): Promise<void> {
    return firebase.auth().signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([`${AppConst.TASKS}`]);
        });
        this.setUserData(result.user);
      }).catch((error) => {
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
      }).catch(err => console.log(err));
    } catch (err) {
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

  public getUserById(id: string): Observable<User> {
    this.userDoc = this.afs.doc<User>(`users/${id}`);
    return this.user = this.userDoc.valueChanges();
  }

  public getAllUsers(id: string): AngularFirestoreCollection<User> {
    return this.afs.collection(this.dbPath, ref => ref
      .where('uid', '==', id));
  }

  public getLimitUsers(): AngularFirestoreCollection<User> {
    return this.afs.collection(this.dbPath, (ref) => ref
      .limit(5));
  }

  public getUsersBySearch(searchText: string): AngularFirestoreCollection<User> {
    return this.afs.collection(this.dbPath, ref => ref
      .orderBy('displayName')
      .where('displayName', '>=', searchText)
      .where('displayName', '<=', searchText + '\uf8ff')
      .limit(5));
  }
}
