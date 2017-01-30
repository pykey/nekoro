import { TestBed, inject } from '@angular/core/testing';
import { MaterialModule, MdSnackBarRef } from '@angular/material';

import { NotificationService } from './notification.service';
import { UsernameAlreadyInUse, usernameAlreadyInUse } from '../errors/user.errors';
import { externalErrors } from '../errors/external.errors';

const internalError = new UsernameAlreadyInUse;
const externalError = { code: 'auth/email-already-in-use', message: '' };
const badExternalError = { code: 'bad/non-exists', message: '' };
const undefinedExternalError = { code: 'auth/bad-non-exists', message: '' };

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule.forRoot() ],
      providers: [ NotificationService ]
    });

    inject([NotificationService], (service: NotificationService) => {
      notificationService = service;
    })();
  });

  it('should be defined', () => {
    expect(notificationService).toBeTruthy();
  });

  describe('Error', () => {
    it('should return a MdSnackBarRef of SimpleSnackBar', () => {
      expect(notificationService.error(internalError) instanceof MdSnackBarRef).toBe(true);
    });

    it('should display the correct message on internal errors', () => {
      const notification = notificationService.error(internalError);

      expect(notification.instance.message).toBe(usernameAlreadyInUse);
    });

    it('should display the correct message on external errors', () => {
      const notification = notificationService.error(externalError);

      expect(notification.instance.message).toBe(externalErrors.auth['email-already-in-use']);
    });

    it('should display the code if no message on external errors', () => {
      const notification = notificationService.error(badExternalError);

      expect(notification.instance.message).toBe(badExternalError.code);
    });

    it('should display the code if no child message on external errors', () => {
      const notification = notificationService.error(undefinedExternalError);

      expect(notification.instance.message).toBe(undefinedExternalError.code);
    });
  });
});
