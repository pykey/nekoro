import { passwordValidator } from './password.validator';

const makeControl = (password: string): any => {
  return { value: password } as any;
};

describe('PasswordValidator', () => {
  it('should return null if the password is valid', () => {
    const password = makeControl('nekoro');

    expect(passwordValidator(password)).toBeNull();
  });

  it('should not return null if the password length is less than 6 characters', () => {
    const password = makeControl('short');

    expect(passwordValidator(password)).not.toBeNull();
  });
});
