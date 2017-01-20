/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FirebaseAuthState } from 'angularfire2';

import * as fromUser from '../actions/user.actions';
import { State, reducer } from './user.reducer';

const firebaseUser = {
  uid: '12345',
  providerData: [{
    displayName: 'jeffbcross',
    providerId: 'github.com'
  }]
} as firebase.User;

const AngularFireAuthState = {
  provider: 0,
  auth: firebaseUser,
  uid: '12345',
  github: {
    displayName: 'FirebaseUser',
    providerId: 'github.com'
  } as firebase.UserInfo
} as FirebaseAuthState;

describe('UserReducer', () => {
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.provideStore({ user: reducer })
      ]
    });

    inject([Store], (s: Store<State>) => {
      store = s;
    })();
  });

  describe('Load', () => {
    it('should change state on LOAD', () => {
      store.dispatch(new fromUser.LoadAction());

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: true,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOAD SUCCESS', () => {
      store.dispatch(new fromUser.LoadSuccessAction(AngularFireAuthState));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: false,
          data: AngularFireAuthState
        });
      });
    });

    it('should change state on LOAD SUCCESS but no found', () => {
      store.dispatch(new fromUser.LoadSuccessAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: false,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOAD FAIL', () => {
      store.dispatch(new fromUser.LoadFailAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: false,
          loggingOut: false,
          data: null
        });
      });
    });
  });

  describe('Login', () => {
    it('should change state on LOGIN', () => {
      store.dispatch(new fromUser.LoginAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: true,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOGIN SUCCESS', () => {
      store.dispatch(new fromUser.LoginSuccessAction(AngularFireAuthState));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: false,
          data: AngularFireAuthState
        });
      });
    });

    it('should change state on LOGIN FAIL', () => {
      store.dispatch(new fromUser.LoginFailAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: false,
          loggingOut: false,
          data: null
        });
      });
    });
  });

  describe('Register', () => {
    it('should change state on REGISTER', () => {
      store.dispatch(new fromUser.RegisterAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual(state.toJS());
      });
    });

    it('should change state on REGISTER SUCCESS', () => {
      store.dispatch(new fromUser.RegisterSuccessAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual(state.toJS());
      });
    });

    it('should change state on REGISTER FAIL', () => {
      store.dispatch(new fromUser.RegisterFailAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual(state.toJS());
      });
    });
  });

  describe('Logout', () => {
    it('should change state on LOGOUT', () => {
      store.dispatch(new fromUser.LoginSuccessAction(AngularFireAuthState));
      store.dispatch(new fromUser.LogoutAction());

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: true,
          data: AngularFireAuthState
        });
      });
    });

    it('should change state on LOGOUT SUCCESS', () => {
      store.dispatch(new fromUser.LoginSuccessAction(AngularFireAuthState));
      store.dispatch(new fromUser.LogoutSuccessAction());

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: false,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOGOUT FAIL', () => {
      store.dispatch(new fromUser.LoginSuccessAction(AngularFireAuthState));
      store.dispatch(new fromUser.LogoutFailAction(null));

      store.select('user').subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: false,
          data: AngularFireAuthState
        });
      });
    });
  });
});
