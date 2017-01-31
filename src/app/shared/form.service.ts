import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { sprintf } from 'sprintf-js';

import { Logger } from '../utils/logger';

const log = Logger.create('service:form');

interface ValidationMessages {
  [key: string]: {
    required?: string;
    minlength?: string;
    invalidUsername?: string;
    invalidEmail?: string;
    invalidPassword?: string;
    notSameAs?: string;
  };
}

@Injectable()
export class FormService {
  form: FormGroup;
  formErrors: { [key: string]: string } = {};
  validationMessages: ValidationMessages;
  valueChangesSubscription: Subscription;

  constructor(private fBuilder: FormBuilder) { }

  /**
   * Creates a new Form Group using the fields passed
   * Parse the fields to add into formErrors
   * Subscribe onValueChanges to form valueChanges method
   *
   * @param {Object} fields Fields to register into Form Group
   * @returns {FormGroup} Builded Form Group
   */
  group(fields: { [key: string]: any }): FormGroup {
    log.info('Create a new Form Group');

    this.form = this.fBuilder.group(fields);

    this.parseFields(fields);

    this.valueChangesSubscription = this.form.valueChanges.subscribe(this.onValueChanges.bind(this));
    this.onValueChanges();

    return this.form;
  }

  /**
   * Remove all active subscriptions
   */
  removeSubscriptions(): void {
    log.info('Remove subscriptions');

    this.valueChangesSubscription.unsubscribe();
  }

  /**
   * Parse the passed fields one by one, and if someone has validators add to formErrors
   *
   * @private
   * @param {Object} fields Fields to parse
   */
  private parseFields(fields: { [key: string]: any }): void {
    log.debug('Parse form fields');

    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        const data = fields[field];

        if (data.constructor === Array &&
          data[1] &&
          (data[1].constructor !== Array || data[1].length)) {
          this.formErrors[field] = '';
        }
      }
    }
  }

  /**
   * Calculate the errors from the form and store the result into formErrors
   *
   * @private
   */
  private onValueChanges(): void {
    log.debug('Calculating form errors');

    if (!this.validationMessages) {
      log.debug('No validation messages defined, skipping...');
      return;
    }

    const form = this.form;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';

        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const error = Object.keys(control.errors)[0];

          this.formErrors[field] = sprintf(this.validationMessages[field][error], control.errors[error]) || '';

          log.debug(`Error on ${field}: ${this.formErrors[field]}`);
        }
      }
    }
  }
}
