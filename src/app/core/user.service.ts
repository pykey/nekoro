import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from 'angularfire2/auth';

import { Logger } from '../utils/logger';

const log = Logger.create('service:user');

@Injectable()
export class UserService {

  constructor(private af: AngularFire) { }

  login(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    log.info('Sending login request to Firebase');

    return this.af.auth.login(credentials);
  }

  register(): void {

  }

  logout(): Promise<void> {
    log.info('Logging out from Firebase');

    return this.af.auth.logout();
  }

  get auth(): AngularFireAuth {
    return this.af.auth;
  }
}
