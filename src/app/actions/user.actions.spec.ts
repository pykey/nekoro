/* tslint:disable:no-unused-variable */

import * as user from './user.actions';

describe('UserActions', () => {
  describe('Load', () => {
    it('should have correct type on call', () => {
      const loadAction = new user.LoadAction();

      expect(loadAction.type).toBe(user.LOAD);
    });

    it('should have correct type and payload on success', () => {
      const loadAction = new user.LoadSuccessAction(null);

      expect(loadAction.type).toBe(user.LOAD_SUCCESS);
      expect(loadAction.payload).toBeNull();
    });

    it('should have correct type and payload on fail', () => {
      const loadAction = new user.LoadFailAction(null);

      expect(loadAction.type).toBe(user.LOAD_FAIL);
      expect(loadAction.payload).toBeNull();
    });
  });

  describe('Login', () => {
    it('should have correct type and payload on call', () => {
      const loginAction = new user.LoginAction(null);

      expect(loginAction.type).toBe(user.LOGIN);
      expect(loginAction.payload).toBeNull();
    });

    it('should have correct type and payload on success', () => {
      const loginAction = new user.LoginSuccessAction(null);

      expect(loginAction.type).toBe(user.LOGIN_SUCCESS);
      expect(loginAction.payload).toBeNull();
    });

    it('should have correct type and payload on fail', () => {
      const loginAction = new user.LoginFailAction(null);

      expect(loginAction.type).toBe(user.LOGIN_FAIL);
      expect(loginAction.payload).toBeNull();
    });
  });

  describe('Register', () => {
    it('should have correct type and payload on call', () => {
      const registerAction = new user.RegisterAction(null);

      expect(registerAction.type).toBe(user.REGISTER);
      expect(registerAction.payload).toBeNull();
    });

    it('should have correct type and payload on success', () => {
      const registerAction = new user.RegisterSuccessAction(null);

      expect(registerAction.type).toBe(user.REGISTER_SUCCESS);
      expect(registerAction.payload).toBeNull();
    });

    it('should have correct type and payload on fail', () => {
      const registerAction = new user.RegisterFailAction(null);

      expect(registerAction.type).toBe(user.REGISTER_FAIL);
      expect(registerAction.payload).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should have correct type on call', () => {
      const logoutAction = new user.LogoutAction();

      expect(logoutAction.type).toBe(user.LOGOUT);
    });

    it('should have correct type on success', () => {
      const logoutAction = new user.LogoutSuccessAction();

      expect(logoutAction.type).toBe(user.LOGOUT_SUCCESS);
    });

    it('should have correct type and payload on fail', () => {
      const logoutAction = new user.LogoutFailAction(null);

      expect(logoutAction.type).toBe(user.LOGOUT_FAIL);
      expect(logoutAction.payload).toBeNull();
    });
  });
});
