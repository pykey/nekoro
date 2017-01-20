/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { AngularFireModule, FirebaseAuthState } from 'angularfire2';

import { firebaseConfig, firebaseAuthConfig } from '../app.module';

import { UserService } from '../core/user.service';

import * as fromUser from '../actions/user.actions';
import { UserEffects } from './user.effects';
import { of } from 'rxjs/observable/of';

const userMethods = [
  'login',
  'logout'
];

const credentials = {
  email: 'david@fire.com',
  password: 'supersecretpassword'
};

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

describe('User Effects', () => {
  let runner: EffectsRunner;
  let userEffects: UserEffects;
  let userService: UserService;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('user', userMethods);
    mockUserService.login.and.returnValue(Promise.resolve(AngularFireAuthState));
    mockUserService.logout.and.returnValue(Promise.resolve(null));

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule,
        AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
      ],
      providers: [
        {
          provide: UserService,
          useFactory() {
            return Object.assign({}, mockUserService, {
              auth: of(null)
            });
          }
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
      runner.queue(new fromUser.LoadAction());

      userEffects.load$.subscribe(result => {
        expect(result).toEqual(new fromUser.LoadSuccessAction(null));
      });
    });
  });

  describe('Login', () => {
    it('should return SUCCESS on LOGIN', () => {
      runner.queue(new fromUser.LoginAction(credentials));

      userEffects.login$.subscribe(result => {
        expect(result).toEqual(new fromUser.LoginSuccessAction(AngularFireAuthState));
      });
    });

    it('should call login on user service', () => {
      runner.queue(new fromUser.LoginAction(credentials));

      userEffects.login$.subscribe(() => {
        expect(userService.login).toHaveBeenCalledWith(credentials);
      });
    });
  });

  describe('Logout', () => {
    it('should return SUCCESS on LOGOUT', () => {
      runner.queue(new fromUser.LogoutAction());

      userEffects.logout$.subscribe(result => {
        expect(result).toEqual(new fromUser.LogoutSuccessAction());
      });
    });

    it('should call logout on user service', () => {
      runner.queue(new fromUser.LogoutAction());

      userEffects.logout$.subscribe(() => {
        expect(userService.logout).toHaveBeenCalled();
      });
    });
  });
});
