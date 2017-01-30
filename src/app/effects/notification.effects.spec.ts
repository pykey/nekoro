import { TestBed, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { NotificationService } from '../core/notification.service';
import * as notification from '../actions/notification.actions';
import { NotificationEffects } from './notification.effects';

const error = { code: 'test/user-effects', message: 'Testing user effects' };
const throwError = new Error();

const notificationMethods = [
  'error'
];

describe('NotificationEffects', () => {
  let runner: EffectsRunner;
  let notificationEffects: NotificationEffects;
  let notificationService: NotificationService;
  let mockNotificationService: any;

  beforeEach(() => {
    mockNotificationService = jasmine.createSpyObj('notification', notificationMethods);
    mockNotificationService.error.and.returnValue({ afterDismissed: () => of(null) });

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService
        },
        NotificationEffects
      ]
    });

    inject([EffectsRunner, NotificationEffects, NotificationService], (eRunner: EffectsRunner,
                                                       effects: NotificationEffects, service: NotificationService) => {
      runner = eRunner;
      notificationEffects = effects;
      notificationService = service;
    })();
  });

  describe('Error', () => {
    it('should return DISMISS on ERROR', () => {
      runner.queue(new notification.ErrorAction(error));

      notificationEffects.error$.subscribe(result => {
        expect(result).toEqual(new notification.ErrorDismissAction(error));
      });
    });

    it('should return FAIL if ERROR fails', () => {
      mockNotificationService.error.and.returnValue({ afterDismissed: () => _throw(throwError) });

      runner.queue(new notification.ErrorAction(error));

      notificationEffects.error$.subscribe(result => {
        expect(result).toEqual(new notification.ErrorFailAction({ error, throwError }));
      });
    });

    it('should call error on notification service', () => {
      runner.queue(new notification.ErrorAction(error));

      notificationEffects.error$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith(error);
      });
    });
  });
});
