import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarRef } from '@angular/material';
import { SimpleSnackBar } from '@angular/material/snack-bar/simple-snack-bar';

import { CodedError } from '../models/coded-error.model';
import { internalErrorNamespaces } from '../errors';
import { externalErrors } from '../errors/external.errors';
import { Logger } from '../utils/logger';

const log = Logger.create('service:notification');

const duration = 5 * 1000;

// TODO: Add to i18n on available angular/angular#11405
const dismissErrorButton = 'Cerrar';

@Injectable()
export class NotificationService {

  constructor(private mdSnackBar: MdSnackBar) { }

  /**
   * Parse the passed error and display the error
   * The message depends if the error is internal or external
   * If the error is internal, use the err.message as text
   * If the error is external, search a result in the externalErrors object and use it as text
   * If the result of the search is undefined, use the err.code as text
   *
   * @param {CodedError} err Error to display
   * @returns {MdSnackBarRef<SimpleSnackBar>} SnackBar reference
   */
  error(err: CodedError): MdSnackBarRef<SimpleSnackBar> {
    log.info('Displaying error');

    const splitted = err.code.split('/'),
      namespace = splitted[0],
      code = splitted[1];

    if (internalErrorNamespaces.indexOf(namespace) === -1) {
      log.debug('Displaying external error');

      let message: string;

      try {
        message = externalErrors[namespace][code];

        if (!message) { throw new Error(); }
      } catch (e) {
        log.warn(`No error message for ${err.code}`);

        message = err.code;
      }

      return this.openSimpleSnackBar(message, dismissErrorButton);
    } else {
      log.debug('Displaying internal error');

      return this.openSimpleSnackBar(err.message, dismissErrorButton);
    }
  }

  /**
   * Display an error using the SnackBar item from Angular Material
   *
   * @private
   * @param {string} message Message to show in the SnackBar
   * @param {string} action Text to show in the SnackBar button
   * @returns {MdSnackBarRef<SimpleSnackBar>} SnackBar reference
   */
  private openSimpleSnackBar(message: string, action?: string): MdSnackBarRef<SimpleSnackBar> {
    return this.mdSnackBar.open(message, action, { duration });
  }
}
