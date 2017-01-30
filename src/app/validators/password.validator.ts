import { AbstractControl } from '@angular/forms';

const minLength = 6;

export const passwordValidator = (control: AbstractControl): {[key: string]: any} => {
  const password = control.value;
  const no = password !== '' && (password.length < minLength);

  return no ? { 'invalidPassword': { minLength } } : null;
};

