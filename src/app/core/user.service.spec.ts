/* tslint:disable:no-unused-variable */

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';

import { TestBed, inject } from '@angular/core/testing';
import { AngularFireModule, FirebaseAppConfig, FirebaseConfig, FirebaseApp, FirebaseAuthState } from 'angularfire2';
import { initializeApp } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { firebaseConfig, firebaseAuthConfig } from '../app.module';
import { UserService } from './user.service';

const authMethods = [
  'signInWithEmailAndPassword',
  'onAuthStateChanged',
  'getRedirectResult',
  'signOut'
];

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

describe('UserService', () => {
  let firebaseApp: firebase.app.App;
  let userService: UserService;
  let fbAuthObserver: Observer<firebase.User>;
  let mockFirebaseAuth: any;

  beforeEach(() => {
    mockFirebaseAuth = jasmine.createSpyObj('auth', authMethods);
    mockFirebaseAuth.signInWithEmailAndPassword.and.returnValue(Promise.resolve(firebaseUser));
    mockFirebaseAuth.onAuthStateChanged.and.callFake((obs: Observer<firebase.User>) => {
      fbAuthObserver = obs;
    });
    mockFirebaseAuth.getRedirectResult.and.returnValue(Promise.resolve(null));

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
      ],
      providers: [
        {
          provide: FirebaseApp,
          useFactory(config: FirebaseAppConfig) {
            const app = initializeApp(config);

            (app as any).auth = () => mockFirebaseAuth;
            return app;
          },
          deps: [FirebaseConfig]
        },
        UserService
      ]
    });

    inject([FirebaseApp, UserService], (app: firebase.app.App, service: UserService) => {
      firebaseApp = app;
      userService = service;
    })();
  });

  afterEach(done => {
    firebaseApp.delete().then(done, done.fail);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Login', () => {
    const credentials = {
      email: 'david@fire.com',
      password: 'supersecretpassword'
    };

    it('should return a Promise', () => {
      expect(userService.login(credentials) instanceof Promise).toBeTruthy();
    });

    it('should login with credentials', () => {
      userService.login(credentials);
      expect(firebaseApp.auth().signInWithEmailAndPassword)
        .toHaveBeenCalledWith(credentials.email, credentials.password);
    });
  });

  describe('Register', () => {
    it('should return undefined', () => {
      expect(userService.register()).toBeUndefined();
    });
  });

  describe('Logout', () => {
    it('should logout the user', () => {
      userService.logout();
      expect(firebaseApp.auth().signOut).toHaveBeenCalled();
    });
  });

  it('#auth should be an observable', () => {
    expect(userService.auth instanceof Observable).toBeTruthy();
  });

  it('#auth should emit auth updates', done => {
    fbAuthObserver.next(null);

    userService.auth
      .take(1)
      .do(authData => {
        expect(authData).toBeNull();
        setTimeout(() => fbAuthObserver.next(firebaseUser));
      })
      .subscribe();

    userService.auth
      .skip(1)
      .take(1)
      .do(authData => expect(authData.auth).toEqual(AngularFireAuthState.auth))
      .subscribe(null, done.fail, done);
  }, 10);
});
