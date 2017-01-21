import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from 'angularfire2/auth';

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
   * @returns {firebase.Promise<FirebaseAuthState>} Login promise, contains auth state is success
   */
  login(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    log.info('Sending login request to Firebase');

    return this.auth().login(credentials);
  }

  /**
   * TODO: WIP
   */
  register(): void {

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
