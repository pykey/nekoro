import { emailValidator } from './email.validator';

const makeControl = (email: string): any => {
  return { value: email } as any;
};

describe('EmailValidator', () => {
  it('should return null if the email is valid', () => {
    const email = makeControl('neko@neko.ro');

    expect(emailValidator(email)).toBeNull();
  });

  it('should not return null if the email length is less than 5 characters', () => {
    const email = makeControl('a@a.a');

    expect(emailValidator(email)).not.toBeNull();
  });

  it('should not return null if the email is not a valid email', () => {
    const email = makeControl('notAnEmail');

    expect(emailValidator(email)).not.toBeNull();
  });
});
