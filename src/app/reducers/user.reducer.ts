import { FirebaseAuthState } from 'angularfire2';
import { Record } from 'immutable';

import * as user from '../actions/user.actions';
import { Logger } from '../utils/logger';

const log = Logger.create('reducer:user');

interface StateI {
  loggedIn: boolean;
  loggingIn: boolean;
  registering: boolean;
  loggingOut: boolean;
  data: FirebaseAuthState | null;
}

const initialState: StateI = {
  loggedIn: false,
  loggingIn: false,
  registering: false,
  loggingOut: false,
  data: null
}, stateRecord = Record(initialState);

export class State extends stateRecord implements StateI {
  loggedIn: boolean;
  loggingIn: boolean;
  registering: boolean;
  loggingOut: boolean;
  data: FirebaseAuthState | null;
}

export const reducer = (state = new State(), action: user.Actions): State => {
  switch (action.type) {
    /**
     * Sets loggingIn to false
     */
    case user.LOAD: {
      log.debug('Requested session load from local storage');

      return state.set('loggingIn', true) as State;
    }

    /**
     * If data was found
     * Sets loggedIn to true
     * Sets loggingIn to false
     * Sets data to Auth State
     *
     * If data wasn't found
     * Sets loggingIn to false
     */
    case user.LOAD_SUCCESS: {
      const data = action.payload;

      if (data) {
        log.info('Session loaded from local storage');

        return state
          .set('loggedIn', true)
          .set('loggingIn', false)
          .set('data', data) as State;
      } else {
        log.info('Session not found in local storage');

        return state.set('loggingIn', false) as State;
      }
    }

    /**
     * Sets loggingIn to false
     */
    case user.LOAD_FAIL: {
      const err = action.payload;

      log.error('Error while loading session from local storage', err);

      return state.set('loggingIn', false) as State;
    }

    /**
     * Sets loggingIn to true
     */
    case user.LOGIN: {
      log.debug('Requested login into Firebase');

      return state.set('loggingIn', true) as State;
    }

    /**
     * Sets loggedIn to true
     * Sets loggingIn to false
     * Sets data to Auth State
     */
    case user.LOGIN_SUCCESS: {
      const data = action.payload;

      log.info('Logged in into Firebase');

      return state
        .set('loggedIn', true)
        .set('loggingIn', false)
        .set('data', data) as State;
    }

    /**
     * Sets loggingIn to false
     */
    case user.LOGIN_FAIL: {
      const err = action.payload;

      log.error('Error while trying to login into Firebase', err);

      return state.set('loggingIn', false) as State;
    }

    case user.REGISTER: {
      log.debug('Requested user register on Firebase');

      return state.set('registering', true) as State;
    }

    case user.REGISTER_SUCCESS: {
      const data = action.payload;

      log.info('Registered into Firebase');

      return state
        .set('loggedIn', true)
        .set('registering', false)
        .set('data', data) as State;
    }

    case user.REGISTER_FAIL: {
      const err = action.payload;

      log.error('Error while trying to register a new account into Firebase', err);

      return state.set('registering', false) as State;
    }

    /**
     * Sets loggingOut to true
     */
    case user.LOGOUT: {
      log.debug('Requested logout');

      return state.set('loggingOut', true) as State;
    }

    /**
     * Sets loggedIn to false
     * Sets loggingOut to false
     * Sets data to null
     */
    case user.LOGOUT_SUCCESS: {
      log.info('Logged out');

      return state
        .set('loggedIn', false)
        .set('loggingOut', false)
        .set('data', null) as State;
    }

    /**
     * Sets loggingOut to false
     */
    case user.LOGOUT_FAIL: {
      const err = action.payload;

      log.error('Error while trying to logout current user', err);

      return state.set('loggingOut', false) as State;
    }

    default: {
      return state;
    }
  }
};

export const isLoggedIn = (state: State): boolean => state.get('loggedIn');
export const isLoggingIn = (state: State): boolean => state.get('loggingIn');
export const isRegistering = (state: State): boolean => state.get('registering');
export const isLoggingOut = (state: State): boolean => state.get('loggingOut');
export const getData = (state: State): FirebaseAuthState | null => state.get('data');
