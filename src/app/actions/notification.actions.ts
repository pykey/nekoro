import { Action } from '@ngrx/store';

import { CodedError } from '../models/coded-error.model';

export const ERROR          = '[Notification] Error';
export const ERROR_DISMISS  = '[Notification] Error Dismiss';
export const ERROR_FAIL     = '[Notification] Error Fail';

/**
 * Displays error to user and store it
 */
export class ErrorAction implements Action {
  readonly type = ERROR;

  constructor(public readonly payload: CodedError) { }
}

export class ErrorDismissAction implements Action {
  readonly type = ERROR_DISMISS;

  constructor(public readonly payload: CodedError) { }
}

export class ErrorFailAction implements Action {
  readonly type = ERROR_FAIL;

  constructor(public readonly payload: { error: CodedError, throwError: Error }) { }
}

export type Actions
  = ErrorAction
  & ErrorDismissAction
  & ErrorFailAction;
