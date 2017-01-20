/* tslint:disable:no-unused-variable */

import * as fromUser from './user.actions';

describe('UserActions', () => {
  describe('Load', () => {
    it('should have correct type on call', () => {
      const loadAction = new fromUser.LoadAction();

      expect(loadAction.type).toBe(fromUser.LOAD);
    });

    it('should have correct type and payload on success', () => {
      const loadAction = new fromUser.LoadSuccessAction(null);

      expect(loadAction.type).toBe(fromUser.LOAD_SUCCESS);
      expect(loadAction.payload).toBeNull();
    });

    it('should have correct type and payload on fail', () => {
      const loadAction = new fromUser.LoadFailAction(null);

      expect(loadAction.type).toBe(fromUser.LOAD_FAIL);
      expect(loadAction.payload).toBeNull();
    });
  });

  describe('Login', () => {
    it('should have correct type and payload on call', () => {
      const loginAction = new fromUser.LoginAction(null);

      expect(loginAction.type).toBe(fromUser.LOGIN);
      expect(loginAction.payload).toBeNull();
    });

    it('should have correct type and payload on success', () => {
      const loginAction = new fromUser.LoginSuccessAction(null);

      expect(loginAction.type).toBe(fromUser.LOGIN_SUCCESS);
      expect(loginAction.payload).toBeNull();
    });

    it('should have correct type and payload on fail', () => {
      const loginAction = new fromUser.LoginFailAction(null);

      expect(loginAction.type).toBe(fromUser.LOGIN_FAIL);
      expect(loginAction.payload).toBeNull();
    });
  });

  describe('Register', () => {
    it('should have correct type and payload on call', () => {
      const registerAction = new fromUser.RegisterAction(null);

      expect(registerAction.type).toBe(fromUser.REGISTER);
      expect(registerAction.payload).toBeNull();
    });

    it('should have correct type and payload on success', () => {
      const registerAction = new fromUser.RegisterSuccessAction(null);

      expect(registerAction.type).toBe(fromUser.REGISTER_SUCCESS);
      expect(registerAction.payload).toBeNull();
    });

    it('should have correct type and payload on fail', () => {
      const registerAction = new fromUser.RegisterFailAction(null);

      expect(registerAction.type).toBe(fromUser.REGISTER_FAIL);
      expect(registerAction.payload).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should have correct type on call', () => {
      const logoutAction = new fromUser.LogoutAction();

      expect(logoutAction.type).toBe(fromUser.LOGOUT);
    });

    it('should have correct type on success', () => {
      const logoutAction = new fromUser.LogoutSuccessAction();

      expect(logoutAction.type).toBe(fromUser.LOGOUT_SUCCESS);
    });

    it('should have correct type and payload on fail', () => {
      const logoutAction = new fromUser.LogoutFailAction(null);

      expect(logoutAction.type).toBe(fromUser.LOGOUT_FAIL);
      expect(logoutAction.payload).toBeNull();
    });
  });
});
