import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';

import { TestBed, inject } from '@angular/core/testing';
import { AngularFireModule, FirebaseAppConfig, FirebaseConfig, FirebaseApp, FirebaseAuthState } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';

import { environment } from '../../environments/environment';
import { firebaseConfig, firebaseAuthConfig } from '../app.module';
import { UserService } from './user.service';
import { mockRegisterForm } from '../models/register-form.model';
import { User } from '../models/user.model';
import { UsernameAlreadyInUse } from '../errors/user.errors';

const authMethods = [
  'signInWithEmailAndPassword',
  'onAuthStateChanged',
  'getRedirectResult',
  'createUserWithEmailAndPassword',
  'signOut'
];

const databaseMethods = [
  'refFromURL'
];

const credentials = {
  email: 'neko@neko.ro',
  password: 'supersecretpassword'
};

const firebaseUser = {
  uid: '12345',
  providerData: [{
    displayName: 'Nekoro',
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

const createDatabaseUrl = (url: string) => environment.firebaseConfig.databaseURL + url;

const usernamesUrl = createDatabaseUrl(`/usernames/${mockRegisterForm.username.toLowerCase()}`);
const usersUrl = createDatabaseUrl(`/users/${AngularFireAuthState.uid}`);

describe('UserService', () => {
  let firebaseApp: firebase.app.App;
  let userService: UserService;
  let fbAuthObserver: Observer<firebase.User>;
  let mockFirebaseAuth: any;
  let mockFirebaseDatabase: any;
  let mockFirebaseDatabaseSet: any;

  beforeEach(() => {
    mockFirebaseAuth = jasmine.createSpyObj('auth', authMethods);
    mockFirebaseAuth.signInWithEmailAndPassword.and.returnValue(Promise.resolve(firebaseUser));
    mockFirebaseAuth.onAuthStateChanged.and.callFake((obs: Observer<firebase.User>) => {
      fbAuthObserver = obs;
    });
    mockFirebaseAuth.getRedirectResult.and.returnValue(Promise.resolve(null));
    mockFirebaseAuth.createUserWithEmailAndPassword.and.returnValue(Promise.resolve(firebaseUser));
    mockFirebaseAuth.signOut.and.returnValue(Promise.resolve(null));

    mockFirebaseDatabaseSet = jasmine.createSpy('set').and.returnValue(Promise.resolve());

    mockFirebaseDatabase = jasmine.createSpyObj('database', databaseMethods);
    mockFirebaseDatabase.refFromURL.and.callFake((url: string) => {
      let $value = null;

      if (url === usernamesUrl) {
        $value = mockRegisterForm.username.toLocaleLowerCase();
      }

      return {
        set: mockFirebaseDatabaseSet,
        on(eventType: string, cb: Function) {
          cb({
            val() {
              return { $value };
            },
            ref: { key: null }
          });
        },
        off() { }
      };
    });

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
      ],
      providers: [
        {
          provide: FirebaseApp,
          useFactory(config: FirebaseAppConfig) {
            const app = firebase.initializeApp(config);

            (app as any).auth = () => mockFirebaseAuth;
            (app as any).database = () => mockFirebaseDatabase;
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

  describe('Auth', () => {
    it('should return an observable', () => {
      expect(userService.auth() instanceof Observable).toBeTruthy();
    });

    it('should emit auth updates', done => {
      fbAuthObserver.next(null);

      userService.auth()
        .take(1)
        .do(authData => {
          expect(authData).toBeNull();
          setTimeout(() => fbAuthObserver.next(firebaseUser));
        })
        .subscribe();

      userService.auth()
        .skip(1)
        .take(1)
        .do(authData => expect(authData.auth).toEqual(AngularFireAuthState.auth))
        .subscribe(null, done.fail, done);
    }, 10);
  });

  describe('Login', () => {
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
    it('should return a Promise', () => {
      expect(userService.register(mockRegisterForm) instanceof Promise).toBe(true);
    });

    it('should register with Register Form', () => {
      userService.register(mockRegisterForm);

      expect(firebaseApp.auth().createUserWithEmailAndPassword)
        .toHaveBeenCalledWith(mockRegisterForm.email, mockRegisterForm.password);
    });
  });

  describe('CheckUsername', () => {
    it('should return an Observable', () => {
      expect(userService.checkUsername(mockRegisterForm.username) instanceof Observable).toBe(true);
    });

    it('should check username at Firebase Database', () => {
      userService.checkUsername(mockRegisterForm.username);

      expect(firebaseApp.database().refFromURL)
        .toHaveBeenCalledWith(usernamesUrl);
    });

    it('should throw error if Username is found and second parameter is true or undefined', () => {
      userService.checkUsername(mockRegisterForm.username).catch(err => {
        expect(err instanceof UsernameAlreadyInUse).toBe(true);

        return of(null);
      }).subscribe();
    });

    it('should return true if Username is found and second parameter is false', () => {
      userService.checkUsername(mockRegisterForm.username, false).subscribe((result: boolean) => {
        expect(result).toBe(true);
      });
    });

    it('should return false if Username is not found', () => {
      userService.checkUsername('randomUsername').subscribe((result: boolean) => {
        expect(result).toBe(false);
      });
    });
  });

  describe('ReserveUsername', () => {
    it('should return a Promise', () => {
      expect(
        userService.reserveUsername(mockRegisterForm.username, AngularFireAuthState.uid) instanceof Promise).toBe(true);
    });

    it('should reserve username at Firebase Database', () => {
      userService.reserveUsername(mockRegisterForm.username, AngularFireAuthState.uid);

      expect(firebaseApp.database().refFromURL)
        .toHaveBeenCalledWith(usernamesUrl);
    });

    it('should use the UID to reserve the username', () => {
      userService.reserveUsername(mockRegisterForm.username, AngularFireAuthState.uid);

      expect(mockFirebaseDatabaseSet).toHaveBeenCalledWith(AngularFireAuthState.uid);
    });
  });

  describe('SaveUser', () => {
    it('should return a Promise', () => {
      expect(userService.saveUser(mockRegisterForm, AngularFireAuthState.uid) instanceof Promise).toBe(true);
    });

    it('should save user into Firebase Database', () => {
      userService.saveUser(mockRegisterForm, AngularFireAuthState.uid);

      expect(firebaseApp.database().refFromURL).toHaveBeenCalledWith(usersUrl);
    });

    it('should use a new User class to save the user', () => {
      userService.saveUser(mockRegisterForm, AngularFireAuthState.uid);

      expect(mockFirebaseDatabaseSet).toHaveBeenCalledWith(new User(mockRegisterForm));
    });
  });

  describe('Logout', () => {
    it('should return a Promise', () => {
      expect(userService.logout() instanceof Promise).toBeTruthy();
    });

    it('should logout the user', () => {
      userService.logout();
      expect(firebaseApp.auth().signOut).toHaveBeenCalled();
    });
  });
});
