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

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(user.LOAD)
    .switchMap(() =>
      this.uService.auth.first()
        .switchMap((authState: FirebaseAuthState) => of(new user.LoadSuccessAction(authState)))
        .catch(/* istanbul ignore next */ err => of(new user.LoadFailAction(err)))
    );

  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(user.LOGIN)
    .map((action: user.LoginAction) => action.payload)
    .switchMap((credentials: EmailPasswordCredentials) =>
      fromPromise(<Promise<FirebaseAuthState>>this.uService.login(credentials))
        .mergeMap((authState: FirebaseAuthState) => of(new user.LoginSuccessAction(authState)))
        .catch(/* istanbul ignore next */ err => of(new user.LoginFailAction(err)))
    );



  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(user.LOGOUT)
    .switchMap(() =>
      fromPromise(this.uService.logout())
        .mergeMap(() => of(new user.LogoutSuccessAction()))
        .catch(/* istanbul ignore next */ err => of(new user.LogoutFailAction(err)))
    );

  constructor(private actions$: Actions, private uService: UserService) { }
}
