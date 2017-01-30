import { Record, List } from 'immutable';

import { Logger } from '../utils/logger';
import * as notification from '../actions/notification.actions';
import { CodedError } from '../models/coded-error.model';

const log = Logger.create('reducer:notification');

interface StateI {
  errors: List<CodedError>;
  dismissedErrors: List<CodedError>;
}

const initialState: StateI = {
  errors: List.of<CodedError>(),
  dismissedErrors: List.of<CodedError>()
}, stateRecord = Record(initialState);

export class State extends stateRecord implements StateI {
  errors: List<CodedError>;
  dismissedErrors: List<CodedError>;
}

export const reducer = (state = new State(), action: notification.Actions): State => {
  switch (action.type) {
    /**
     * Adds error to errors
     */
    case notification.ERROR: {
      const error = action.payload;

      log.debug('Requested error display');

      return state.update('errors', (errors: List<CodedError>) => errors.push(error)) as State;
    }

    /**
     * Removes error from errors
     * Adds error to dismissedErrors
     */
    case notification.ERROR_DISMISS: {
      const error = action.payload;

      log.debug('Error dismissed');

      return state
        .update('errors', (errors: List<CodedError>) => errors.delete(errors.indexOf(error)))
        .update('dismissedErrors', (dismissedErrors: List<CodedError>) => dismissedErrors.push(error)) as State;
    }

    /**
     * Removes error from errors
     * Adds error to dismissedErrors
     */
    case notification.ERROR_FAIL: {
      const error = action.payload.error;
      const throwError = action.payload.throwError;

      log.error(`Error displaying error ${error}`, throwError);

      return state
        .update('errors', (errors: List<CodedError>) => errors.delete(errors.indexOf(error)))
        .update('dismissedErrors', (dismissedErrors: List<CodedError>) => dismissedErrors.push(error)) as State;
    }

    default: {
      return state;
    }
  }
};

export const getErrors = (state: State) => state.get('errors');
export const getDismissedErrors = (state: State) => state.get('dismissedErrors');
