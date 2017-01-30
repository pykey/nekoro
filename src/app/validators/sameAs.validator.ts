import { ValidatorFn, AbstractControl } from '@angular/forms';

import { Logger } from '../utils/logger';

const log = Logger.create('validator:sameAs');

export const sameAsValidator = (fieldTarget: string): ValidatorFn => {
  return (control: AbstractControl): {[key: string]: any} => {
    const value = control.value;
    const targetEl = control.root.get(fieldTarget);

    // At form creation this value is always null
    if (!targetEl) { return null; }

    const target = targetEl.value;
    const no = value !== '' && target && value !== target;

    return no ? { 'notSameAs': { value, target } } : null;
  };
};
