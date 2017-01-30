import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { NotificationService } from '../core/notification.service';
import * as notification from '../actions/notification.actions';
import { CodedError } from '../models/coded-error.model';

@Injectable()
export class NotificationEffects {

  /**
   * Watches notification error action
   * Calls error method from notification service
   * Executes error dismiss action if notification success
   *
   * @type {Observable<Action>} Observable that execute the passed action
   */
  @Effect()
  error$: Observable<Action> = this.actions$
    .ofType(notification.ERROR)
    .map((action: notification.ErrorAction) => action.payload)
    .switchMap((error: CodedError) =>
      this.nService.error(error)
        .afterDismissed()
        .mergeMap(() => of(new notification.ErrorDismissAction(error)))
        .catch(throwError => of(new notification.ErrorFailAction({ error, throwError })))
    );

  constructor(private actions$: Actions, private nService: NotificationService) { }
}
