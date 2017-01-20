import { FirebaseAuthState } from 'angularfire2';
import { Record } from 'immutable';

import * as user from '../actions/user.actions';
import { Logger } from '../utils/logger';

const log = Logger.create('reducer:user');

interface StateI {
  loggedIn: boolean;
  loggingIn: boolean;
  loggingOut: boolean;
  data: FirebaseAuthState | null;
}

const initialState: StateI = {
  loggedIn: false,
  loggingIn: false,
  loggingOut: false,
  data: null
}, stateRecord = Record(initialState);

export class State extends stateRecord implements StateI {
  loggedIn: boolean;
  loggingIn: boolean;
  loggingOut: boolean;
  data: FirebaseAuthState | null;
}

export const reducer = (state = new State(), action: user.Actions): State => {
  switch (action.type) {
    case user.LOAD: {
      log.debug('Requested session load from local storage');

      return state.set('loggingIn', true) as State;
    }

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

    case user.LOAD_FAIL: {
      const err = action.payload;

      log.error('Error while loading session from local storage', err);

      return state.set('loggingIn', false) as State;
    }

    case user.LOGIN: {
      log.debug('Requested login into Firebase');

      return state.set('loggingIn', true) as State;
    }

    case user.LOGIN_SUCCESS: {
      const data = action.payload;

      log.info('Logged in into Firebase');

      return state
        .set('loggedIn', true)
        .set('loggingIn', false)
        .set('data', data) as State;
    }

    case user.LOGIN_FAIL: {
      const err = action.payload;

      log.error('Error while trying to login into Firebase', err);

      return state.set('loggingIn', false) as State;
    }

    case user.REGISTER: {
      return state;
    }

    case user.REGISTER_SUCCESS: {
      return state;
    }

    case user.REGISTER_FAIL: {
      const err = action.payload;

      log.error('Error while trying to register a new account into Firebase', err);

      return state;
    }

    case user.LOGOUT: {
      log.debug('Requested logout');

      return state.set('loggingOut', true) as State;
    }

    case user.LOGOUT_SUCCESS: {
      log.info('Logged out');

      return state
        .set('loggedIn', false)
        .set('loggingOut', false)
        .set('data', null) as State;
    }

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

/* istanbul ignore next */ export const isLoggedIn = (state: State) => state.get('loggedIn');
/* istanbul ignore next */ export const isLoggingIn = (state: State) => state.get('loggingIn');
/* istanbul ignore next */ export const isLoggingOut = (state: State) => state.get('loggingOut');
/* istanbul ignore next */ export const getData = (state: State) => state.get('data');
