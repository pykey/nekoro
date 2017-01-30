import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { RegisterForm } from '../models/register-form.model';
import { User } from '../models/user.model';
import { UsernameAlreadyInUse } from '../errors/user.errors';
import { Logger } from '../utils/logger';

const log = Logger.create('service:user');

@Injectable()
export class UserService {

  constructor(private af: AngularFire) { }

  /**
   * Returns auth object from AngularFire
   *
   * @returns {AngularFireAuth} Auth object
   */
  auth(): AngularFireAuth {
    return this.af.auth;
  }

  /**
   * Tries to login into Firebase using login method of auth object from AngularFire
   *
   * @param {EmailPasswordCredentials} credentials Email and password to use on login
   * @returns {Promise<FirebaseAuthState>} Login promise, contains auth state if success
   */
  login(credentials: EmailPasswordCredentials): Promise<FirebaseAuthState> {
    log.info('Sending login request to Firebase');

    return this.auth().login(credentials) as Promise<FirebaseAuthState>;
  }

  /**
   * Tries to register a new account into Firebase using createUser of auth object from AngularFire
   *
   * @param {RegisterForm} userData Result from Register Form
   * @returns {Promise<FirebaseAuthState>} Create User promise, contains auth state if success
   */
  register(userData: RegisterForm): Promise<FirebaseAuthState> {
    log.info('Sending register request to Firebase');

    const { email, password } = userData;

    return this.auth().createUser({ email, password }) as Promise<FirebaseAuthState>;
  }

  /**
   * Check if username is already used on Firebase
   *
   * @param {string} username Username to check
   * @param {boolean} shouldThrow=true Should throw an error instead of true if found
   * @returns {Observable<boolean>} Boolean observable, true if found, false if not
   */
  checkUsername(username: string, shouldThrow = true): Observable<boolean> {
    log.info('Check if username already exists in Firebase');

    return this.af.database.object(`/usernames/${username.toLowerCase()}`)
      .first()
      .map(data => data['$value'])
      .switchMap((result: string) => {
        if (result) {
          if (shouldThrow) { return _throw(new UsernameAlreadyInUse()); }

          return of(true);
        } else {
          return of(false);
        }
      });
  }

  /**
   * Reserve an username on Firebase with the UID as value
   *
   * @param {string} username Username to reserve
   * @param {string} uid UID of the user
   * @returns {Promise<void>} Set Promise
   */
  reserveUsername(username: string, uid: string): Promise<void> {
    log.info('Reserving username on Firebase database');

    return this.af.database.object(`/usernames/${username.toLowerCase()}`)
      .set(uid) as Promise<void>;
  }

  /**
   * Save the user data into Firebase with the UID as key
   *
   * @param {RegisterForm} userData Result from Register Form
   * @param {string} uid UID of the user
   * @returns {Promise<void>} Set Promise
   */
  saveUser(userData: RegisterForm, uid: string): Promise<void> {
    log.info('Saving user data into Firebase database');

    return this.af.database.object(`/users/${uid}`)
      .set(new User(userData)) as Promise<void>;
  }

  /**
   * Tries to logout from Firebase using logout method of auth object from AngularFire
   *
   * @returns {Promise<void>} Logout promise, rejects on error
   */
  logout(): Promise<void> {
    log.info('Logging out from Firebase');

    return this.af.auth.logout();
  }
}
