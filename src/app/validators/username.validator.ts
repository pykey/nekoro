import { AbstractControl } from '@angular/forms';

const minLength = 4;
const maxLength = 24;

export const usernameValidator = (control: AbstractControl): {[key: string]: any} => {
  const username = control.value;
  const no = username !== '' && (username.length < minLength || username.length > maxLength);

  return no ? { 'invalidUsername': { minLength, maxLength } } : null;
};
