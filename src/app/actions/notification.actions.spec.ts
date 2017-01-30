import * as notification from './notification.actions';

const error = { code: 'test/notification-actions', message: 'Testing notification actions' };
const throwError = new Error();

describe('NotificationActions', () => {
  describe('Error', () => {
    it('should have correct type and payload on call', () => {
      const errorAction = new notification.ErrorAction(error);

      expect(errorAction.type).toBe(notification.ERROR);
      expect(errorAction.payload).toBe(error);
    });

    it('should have correct type and payload on dismiss', () => {
      const errorAction = new notification.ErrorDismissAction(error);

      expect(errorAction.type).toBe(notification.ERROR_DISMISS);
      expect(errorAction.payload).toBe(error);
    });

    it('should have correct type and payload on fail', () => {
      const errorAction = new notification.ErrorFailAction({ error, throwError });

      expect(errorAction.type).toBe(notification.ERROR_FAIL);
      expect(errorAction.payload).toEqual({ error, throwError });
    });
  });
});
