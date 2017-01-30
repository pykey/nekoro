import * as fromRouter from '@ngrx/router-store';
import { combineReducers, Action } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as fromNotification from './notification.reducer';
import * as fromUser from './user.reducer';

export interface State {
  notification: fromNotification.State;
  user: fromUser.State;
  router: fromRouter.RouterState;
}

const reducers = {
  notification: fromNotification.reducer,
  user: fromUser.reducer,
  router: fromRouter.routerReducer
};

export function reducer(state: any, action: Action): any {
  return combineReducers(reducers)(state, action);
}

export const getNotificationState = (state: State) => state.notification;
export const getNotificationErrors = createSelector(getNotificationState, fromNotification.getErrors);
export const getNotificationDismissedErrors =
  createSelector(getNotificationState, fromNotification.getDismissedErrors);

export const getUserState = (state: State): fromUser.State => state.user;
export const isUserLoggedIn = createSelector(getUserState, fromUser.isLoggedIn);
export const isUserLoggingIn = createSelector(getUserState, fromUser.isLoggingIn);
export const isUserRegistering = createSelector(getUserState, fromUser.isRegistering);
export const isUserLoggingOut = createSelector(getUserState, fromUser.isLoggingOut);
export const getUserData = createSelector(getUserState, fromUser.getData);
