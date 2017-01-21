/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FirebaseAuthState } from 'angularfire2';

import * as user from '../actions/user.actions';
import * as fromRoot from './';
import { State } from './user.reducer';

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

  describe('Load', () => {
    it('should change state on LOAD', () => {
      store.dispatch(new user.LoadAction());

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: true,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOAD SUCCESS', () => {
      store.dispatch(new user.LoadSuccessAction(AngularFireAuthState));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: false,
          data: AngularFireAuthState
        });
      });
    });

    it('should change state on LOAD SUCCESS but no found', () => {
      store.dispatch(new user.LoadSuccessAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: false,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOAD FAIL', () => {
      store.dispatch(new user.LoadFailAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
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
      store.dispatch(new user.LoginAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: true,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOGIN SUCCESS', () => {
      store.dispatch(new user.LoginSuccessAction(AngularFireAuthState));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: false,
          data: AngularFireAuthState
        });
      });
    });

    it('should change state on LOGIN FAIL', () => {
      store.dispatch(new user.LoginFailAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
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
      store.dispatch(new user.RegisterAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual(state.toJS());
      });
    });

    it('should change state on REGISTER SUCCESS', () => {
      store.dispatch(new user.RegisterSuccessAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual(state.toJS());
      });
    });

    it('should change state on REGISTER FAIL', () => {
      store.dispatch(new user.RegisterFailAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual(state.toJS());
      });
    });
  });

  describe('Logout', () => {
    it('should change state on LOGOUT', () => {
      store.dispatch(new user.LoginSuccessAction(AngularFireAuthState));
      store.dispatch(new user.LogoutAction());

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: true,
          data: AngularFireAuthState
        });
      });
    });

    it('should change state on LOGOUT SUCCESS', () => {
      store.dispatch(new user.LoginSuccessAction(AngularFireAuthState));
      store.dispatch(new user.LogoutSuccessAction());

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: false,
          loggingIn: false,
          loggingOut: false,
          data: null
        });
      });
    });

    it('should change state on LOGOUT FAIL', () => {
      store.dispatch(new user.LoginSuccessAction(AngularFireAuthState));
      store.dispatch(new user.LogoutFailAction(null));

      store.select(fromRoot.getUserState).subscribe((state: State) => {
        expect(state.toJS()).toEqual({
          loggedIn: true,
          loggingIn: false,
          loggingOut: false,
          data: AngularFireAuthState
        });
      });
    });
  });

  it('#isLoggedIn should return loggedIn from state', () => {
    store.select(fromRoot.isUserLoggedIn).subscribe((loggedIn: boolean) => {
      expect(loggedIn).toBe(false);
    });
  });

  it('#isLoggingIn should return loggingIn from state', () => {
    store.select(fromRoot.isUserLoggingIn).subscribe((loggingIn: boolean) => {
      expect(loggingIn).toBe(false);
    });
  });

  it('#isLoggingOut should return loggingOut from state', () => {
    store.select(fromRoot.isUserLoggingOut).subscribe((loggingOut: boolean) => {
      expect(loggingOut).toBe(false);
    });
  });

  it('#getData should return data from state', () => {
    store.select(fromRoot.getUserData).subscribe((data: FirebaseAuthState) => {
      expect(data).toBe(null);
    });
  });
});
