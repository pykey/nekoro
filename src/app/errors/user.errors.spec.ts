import * as userErrors from './user.errors';

describe('UserErrors', () => {
  describe('UsernameAlreadyInUse', () => {
    it('should return an UsernameAlreadyInUse error with the correct code and message', () => {
      const error = new userErrors.UsernameAlreadyInUse();

      expect(error instanceof userErrors.UsernameAlreadyInUse).toBe(true);
      expect(error.name).toBe(error.constructor.name);
      expect(error.code).toBe(userErrors.USERNAME_ALREADY_IN_USE);
      expect(error.message).toBe(userErrors.usernameAlreadyInUse);
    });
  });
});
