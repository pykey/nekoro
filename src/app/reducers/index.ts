import * as fromRouter from '@ngrx/router-store';
import { combineReducers, Action } from '@ngrx/store';
import { createSelector } from 'reselect';

export interface State {
  router: fromRouter.RouterState;
}

const reducers = {
  router: fromRouter.routerReducer
};

export function reducer(state: any, action: Action): any {
  return combineReducers(reducers)(state, action);
}
