import * as fromRouter from '@ngrx/router-store';
import { combineReducers, Action } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as fromUser from './user.reducer';

export interface State {
  user: fromUser.State;
  router: fromRouter.RouterState;
}

const reducers = {
  user: fromUser.State,
  router: fromRouter.routerReducer
};

export function reducer(state: any, action: Action): any {
  return combineReducers(reducers)(state, action);
}

export const getUserState = (state: State) => state.user;
export const isUserLoggedIn = createSelector(getUserState, fromUser.isLoggedIn);
export const isUserLoggingIn = createSelector(getUserState, fromUser.isLoggingIn);
export const isUserLoggingOut = createSelector(getUserState, fromUser.isLoggingOut);
export const getUserData = createSelector(getUserState, fromUser.getData);
