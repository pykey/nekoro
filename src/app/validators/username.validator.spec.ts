import { usernameValidator } from './username.validator';

const makeControl = (username: string): any => {
  return { value: username } as any;
};

describe('UsernameValidator', () => {
  it('should return null is username is valid', () => {
    const username = makeControl('nekoro');

    expect(usernameValidator(username)).toBeNull();
  });

  it('should not return null if the username length is less than 4 characters', () => {
    const username = makeControl('ana');

    expect(usernameValidator(username)).not.toBeNull();
  });

  it('should not return null if the username length is long than 24 characters', () => {
    const username = makeControl('nyanNyanNyanNyanNyanNyanNyanNyanNyanNyanNyan');

    expect(usernameValidator(username)).not.toBeNull();
  });
});
