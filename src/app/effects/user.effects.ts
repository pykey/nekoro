import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { FirebaseAuthState } from 'angularfire2';
import { EmailPasswordCredentials } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';

import { UserService } from '../core/user.service';
import * as notification from '../actions/notification.actions';
import * as user from '../actions/user.actions';
import { RegisterForm } from '../models/register-form.model';

@Injectable()
export class UserEffects {

  /**
   * Watches user load action
   * Calls auth observable from user service
   * Executes user load success action if load success
   * Executes user load fail action if load fails
   * Executes notification error action if load fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(user.LOAD)
    .switchMap(() =>
      this.uService.auth().first()
        .mergeMap((authState: FirebaseAuthState) => of(new user.LoadSuccessAction(authState)))
        .catch(err => from([ new user.LoadFailAction(err), new notification.ErrorAction(err) ]))
    );

  /**
   * Watches user login action
   * Calls login method from user service
   * Executes user login success action if login success
   * Executes user login fail action if login fails
   * Executes notification error action if login fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(user.LOGIN)
    .map((action: user.LoginAction) => action.payload)
    .switchMap((credentials: EmailPasswordCredentials) =>
      fromPromise(this.uService.login(credentials))
        .mergeMap((authState: FirebaseAuthState) => of(new user.LoginSuccessAction(authState)))
        .catch(err => from([ new user.LoginFailAction(err), new notification.ErrorAction(err) ]))
    );

  /**
   * Watches user register action
   * Calls checkUsername method from user service
   * Calls register method from user service
   * Calls reserveUsername method from user service
   * Calls saveUser method from user service
   * Executes register success action if register success
   * Executes register fail action if register fails
   * Executes notification error action if register fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  register$: Observable<Action> = this.actions$
    .ofType(user.REGISTER)
    .map((action: user.RegisterAction) => action.payload)
    .switchMap((userData: RegisterForm) =>
      this.uService.checkUsername(userData.username)
        .mergeMap(() =>
          fromPromise(this.uService.register(userData))
            .mergeMap((authState: FirebaseAuthState) =>
              fromPromise(this.uService.reserveUsername(userData.username, authState.uid))
                .mergeMap(() =>
                  fromPromise(this.uService.saveUser(userData, authState.uid))
                    .mergeMap(() => of(new user.RegisterSuccessAction(authState)))
                )
            )
        )
        .catch(err => from([ new user.RegisterFailAction(err), new notification.ErrorAction(err) ]))
    );

  /**
   * Watches user logout action
   * Calls logout mehotd from user service
   * Executes user logout success action if logout success
   * Executes user logout fail if logout fails
   * Executes notification error action if logout fails
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(user.LOGOUT)
    .switchMap(() =>
      fromPromise(this.uService.logout())
        .mergeMap(() => of(new user.LogoutSuccessAction()))
        .catch(err => from([ new user.LogoutFailAction(err), new notification.ErrorAction(err) ]))
    );

  constructor(private actions$: Actions, private uService: UserService) { }
}
