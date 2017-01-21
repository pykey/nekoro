import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { FirebaseAuthState } from 'angularfire2';
import { EmailPasswordCredentials } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';

import { UserService } from '../core/user.service';
import * as user from '../actions/user.actions';

@Injectable()
export class UserEffects {

  /**
   * Watches user load action
   * Calls auth observable from user service
   * Executes user load success action if load success
   * Executes user load fail action if load fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(user.LOAD)
    .switchMap(() =>
      this.uService.auth().first()
        .switchMap((authState: FirebaseAuthState) => of(new user.LoadSuccessAction(authState)))
        .catch(err => of(new user.LoadFailAction(err)))
    );

  /**
   * Watches user login action
   * Calls login method from user service
   * Executes user login success action if login success
   * Executes user login fail action if login fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(user.LOGIN)
    .map((action: user.LoginAction) => action.payload)
    .switchMap((credentials: EmailPasswordCredentials) =>
      fromPromise(<Promise<FirebaseAuthState>>this.uService.login(credentials))
        .mergeMap((authState: FirebaseAuthState) => of(new user.LoginSuccessAction(authState)))
        .catch(err => of(new user.LoginFailAction(err)))
    );


  /**
   * Watches user logout action
   * Calls logout mehotd from user service
   * Executes user logout success action if logout success
   * Executes user logout fail if logout fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(user.LOGOUT)
    .switchMap(() =>
      fromPromise(this.uService.logout())
        .mergeMap(() => of(new user.LogoutSuccessAction()))
        .catch(err => of(new user.LogoutFailAction(err)))
    );

  constructor(private actions$: Actions, private uService: UserService) { }
}
