import { AbstractControl } from '@angular/forms';

export const emailValidator = (control: AbstractControl): {[key: string]: any} => {
  const email_reg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  const email = control.value;
  const no = email !== '' && (email.length <= 5 || !email_reg.test(email));

  return no ? { 'invalidEmail': { email } } : null;
};
