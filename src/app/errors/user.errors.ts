import { BaseError } from './';

export const USERNAME_ALREADY_IN_USE = 'user/username-already-in-use';

// TODO: Add to i18n on available angular/angular#11405
export const usernameAlreadyInUse = 'El nombre de usuario introducido ya esta en uso';

export class UsernameAlreadyInUse extends BaseError {

  constructor() {
    super(USERNAME_ALREADY_IN_USE, usernameAlreadyInUse);
  }
}
