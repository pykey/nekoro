import { TestBed, inject } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { List } from 'immutable';

import * as notification from '../actions/notification.actions';
import * as fromRoot from './';
import { State } from './notification.reducer';
import { CodedError } from '../models/coded-error.model';

const error = { code: 'test/notification-reducer', message: 'Testing notification reducer' };
const throwError = new Error();

describe('NotificationReducer', () => {
  let store: Store<fromRoot.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.provideStore(fromRoot.reducer)
      ]
    });

    inject([Store], (s: Store<fromRoot.State>) => {
      store = s;
    })();
  });

  describe('Error', () => {
    it('should change state on ERROR', () => {
      store.dispatch(new notification.ErrorAction(error));

      store.select(fromRoot.getNotificationState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          errors: [ error ],
          dismissedErrors: []
        });
      });
    });

    it('should change state on ERROR DISMISS', () => {
      store.dispatch(new notification.ErrorAction(error));
      store.dispatch(new notification.ErrorDismissAction(error));

      store.select(fromRoot.getNotificationState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          errors: [],
          dismissedErrors: [ error ]
        });
      });
    });

    it('should change state on ERROR FAIL', () => {
      store.dispatch(new notification.ErrorAction(error));
      store.dispatch(new notification.ErrorFailAction({ error, throwError }));

      store.select(fromRoot.getNotificationState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          errors: [],
          dismissedErrors: [ error ]
        });
      });
    });
  });

  it('#getErrors should return errors from state', () => {
    store.select(fromRoot.getNotificationErrors).subscribe((errors: List<CodedError>) => {
      expect(errors.toJS()).toEqual([]);
    });
  });

  it('#getDismissedErrors should return dismissedErrors from state', () => {
    store.select(fromRoot.getNotificationDismissedErrors).subscribe((dismissedErrors: List<CodedError>) => {
      expect(dismissedErrors.toJS()).toEqual([]);
    });
  });
});
