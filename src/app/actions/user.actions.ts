import { Action } from '@ngrx/store';
import { FirebaseAuthState } from 'angularfire2';
import { EmailPasswordCredentials } from 'angularfire2/auth';

export const LOAD             = '[User] Load';
export const LOAD_SUCCESS     = '[User] Load Success';
export const LOAD_FAIL        = '[User] Load Fail';
export const LOGIN            = '[User] Login';
export const LOGIN_SUCCESS    = '[User] Login Success';
export const LOGIN_FAIL       = '[User] Login Fail';
export const REGISTER         = '[User] Register';
export const REGISTER_SUCCESS = '[User] Register Success';
export const REGISTER_FAIL    = '[User] Register Fail';
export const LOGOUT           = '[User] Logout';
export const LOGOUT_SUCCESS   = '[User] Logout Success';
export const LOGOUT_FAIL      = '[User] Logout Fail';

/**
 * Load stored user in local storage
 */
export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public readonly payload: FirebaseAuthState) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public readonly payload: any) { }
}

/**
 * Login user into Firebase
 */
export class LoginAction implements Action {
  readonly type = LOGIN;

  constructor(public readonly payload: EmailPasswordCredentials) { }
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public readonly payload: FirebaseAuthState) { }
}

export class LoginFailAction implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public readonly payload: any) { }
}

/**
 * Register new user into Firebase
 *
 * TODO: Complete registration process, need to implement database to store user data
 */
export class RegisterAction implements Action {
  type = REGISTER;

  constructor(public readonly payload: any) { }
}

export class RegisterSuccessAction implements Action {
  type = REGISTER_SUCCESS;

  constructor(public readonly payload: FirebaseAuthState) { }
}

export class RegisterFailAction implements Action {
  type = REGISTER_FAIL;

  constructor(public readonly payload: any) { }
}

/**
 * Logout current user
 */
export class LogoutAction implements Action {
  type = LOGOUT;
}

export class LogoutSuccessAction implements Action {
  type = LOGOUT_SUCCESS;
}

export class LogoutFailAction implements Action {
  type = LOGOUT_FAIL;

  constructor(public readonly payload: any) { }
}

export type Actions
  = LoadAction
  & LoadSuccessAction
  & LoadFailAction
  & LoginAction
  & LoginSuccessAction
  & LoginFailAction
  & RegisterAction
  & RegisterSuccessAction
  & RegisterFailAction
  & LogoutAction
  & LogoutSuccessAction
  & LogoutFailAction;
