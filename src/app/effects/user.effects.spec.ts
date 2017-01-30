import 'rxjs/add/operator/skip';

import { TestBed, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { AngularFireModule, FirebaseAuthState } from 'angularfire2';
import { isEqual } from 'lodash';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { firebaseConfig, firebaseAuthConfig } from '../app.module';
import { UserService } from '../core/user.service';
import * as notification from '../actions/notification.actions';
import * as user from '../actions/user.actions';
import { UserEffects } from './user.effects';
import { mockRegisterForm } from '../models/register-form.model';

const error = { code: 'test/user-effects', message: 'Testing user effects' };

const userMethods = [
  'auth',
  'login',
  'register',
  'checkUsername',
  'reserveUsername',
  'saveUser',
  'logout'
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

describe('UserEffects', () => {
  let runner: EffectsRunner;
  let userEffects: UserEffects;
  let userService: UserService;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('user', userMethods);
    mockUserService.auth.and.returnValue(of(null));
    mockUserService.login.and.returnValue(Promise.resolve(AngularFireAuthState));
    mockUserService.register.and.returnValue(Promise.resolve(AngularFireAuthState));
    mockUserService.checkUsername.and.returnValue(of(true));
    mockUserService.reserveUsername.and.returnValue(Promise.resolve());
    mockUserService.saveUser.and.returnValue(Promise.resolve());
    mockUserService.logout.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule,
        AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
      ],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        UserEffects
      ]
    });

    inject([EffectsRunner, UserEffects, UserService], (eRunner: EffectsRunner,
                                                       effects: UserEffects, service: UserService) => {
      runner = eRunner;
      userEffects = effects;
      userService = service;
    })();
  });

  describe('Load', () => {
    it('should return SUCCESS on LOAD', () => {
      runner.queue(new user.LoadAction());

      userEffects.load$.subscribe(result => {
        expect(result).toEqual(new user.LoadSuccessAction(null));
      });
    });

    it('should return FAIL if LOAD fails', () => {
      mockUserService.auth.and.returnValue(_throw(error));

      runner.queue(new user.LoadAction());

      userEffects.load$.subscribe(result => {
        const doubleEqual =
          isEqual(result, new user.LoadFailAction(error)) ||
          isEqual(result, new notification.ErrorAction(error));

        expect(doubleEqual).toBe(true);
      });
    });

    it('should call auth on user service', () => {
      runner.queue(new user.LoadAction());

      userEffects.login$.subscribe(() => {
        expect(userService.auth).toHaveBeenCalled();
      });
    });
  });

  describe('Login', () => {
    it('should return SUCCESS on LOGIN', () => {
      runner.queue(new user.LoginAction(credentials));

      userEffects.login$.subscribe(result => {
        expect(result).toEqual(new user.LoginSuccessAction(AngularFireAuthState));
      });
    });

    it('should return FAIL if LOGIN fails', () => {
      mockUserService.login.and.returnValue(Promise.reject(error));

      runner.queue(new user.LoginAction(credentials));

      userEffects.login$.subscribe(result => {
        const doubleEqual =
          isEqual(result, new user.LoginFailAction(error)) ||
          isEqual(result, new notification.ErrorAction(error));

        expect(doubleEqual).toBe(true);
      });
    });

    it('should call login on user service', () => {
      runner.queue(new user.LoginAction(credentials));

      userEffects.login$.subscribe(() => {
        expect(userService.login).toHaveBeenCalledWith(credentials);
      });
    });
  });

  describe('Register', () => {
    it('should return SUCCESS on REGISTER', () => {
      runner.queue(new user.RegisterAction(mockRegisterForm));

      userEffects.register$.subscribe(result => {
        expect(result).toEqual(new user.RegisterSuccessAction(AngularFireAuthState));
      });
    });

    it('should return FAIL on REGISTER fails', () => {
      mockUserService.register.and.returnValue(Promise.reject(error));

      runner.queue(new user.RegisterAction(mockRegisterForm));

      userEffects.register$.subscribe(result => {
        const doubleEqual =
          isEqual(result, new user.RegisterFailAction(error)) ||
          isEqual(result, new notification.ErrorAction(error));

        expect(doubleEqual).toBe(true);
      });
    });

    it('should call some methods on user service', () => {
      runner.queue(new user.RegisterAction(mockRegisterForm));

      userEffects.register$.skip(1).subscribe(() => {
        expect(userService.checkUsername).toHaveBeenCalledWith(mockRegisterForm.username);
        expect(userService.register).toHaveBeenCalledWith(mockRegisterForm);
        expect(userService.reserveUsername).toHaveBeenCalledWith(mockRegisterForm.username, AngularFireAuthState.uid);
        expect(userService.saveUser).toHaveBeenCalledWith(mockRegisterForm, AngularFireAuthState.uid);
      });
    });
  });

  describe('Logout', () => {
    it('should return SUCCESS on LOGOUT', () => {
      runner.queue(new user.LogoutAction());

      userEffects.logout$.subscribe(result => {
        expect(result).toEqual(new user.LogoutSuccessAction());
      });
    });

    it('should return FAIL if LOGOUT fails', () => {
      mockUserService.logout.and.returnValue(Promise.reject(error));

      runner.queue(new user.LogoutAction());

      userEffects.logout$.subscribe(result => {
        const doubleEqual =
          isEqual(result, new user.LogoutFailAction(error)) ||
          isEqual(result, new notification.ErrorAction(error));

        expect(doubleEqual).toBe(true);
      });
    });

    it('should call logout on user service', () => {
      runner.queue(new user.LogoutAction());

      userEffects.logout$.subscribe(() => {
        expect(userService.logout).toHaveBeenCalled();
      });
    });
  });
});
