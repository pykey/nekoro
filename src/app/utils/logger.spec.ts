/* tslint:disable:no-unused-variable */

import { Logger } from './logger';

const logName = 'logger:spec';
const message = 'Test message';
const extraParam = new Array(10);

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    spyOn(console, 'log');
    spyOn(console, 'debug');
    spyOn(console, 'info');
    spyOn(console, 'warn');
    spyOn(console, 'error');

    logger = Logger.create(null);
  });

  describe('Create', () => {
    it('should return a new instace of Logger', () => {
      expect(Logger.create(logName) instanceof Logger).toBeTruthy();
    });
  });

  describe('Log', () => {
    it('should write to console as log', () => {
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything());
    });

    it('should write to console all parameters', () => {
      logger.log(message, extraParam);
      expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.arrayContaining(extraParam));
    });

    it('should be disabled when specified', () => {
      logger.enabled = false;

      logger.log(message);
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('Debug', () => {
    it('should write to console as debug', () => {
      logger.debug(message);
      expect(console.debug).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything());
    });

    it('should write to console all parameters', () => {
      logger.debug(message, extraParam);
      expect(console.debug).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.arrayContaining(extraParam));
    });

    it('should be disabled when specified', () => {
      logger.enabled = false;

      logger.debug(message);
      expect(console.debug).not.toHaveBeenCalled();
    });
  });

  describe('Info', () => {
    it('should write to console as info', () => {
      logger.info(message);
      expect(console.info).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything());
    });

    it('should write to console all parameters', () => {
      logger.info(message, extraParam);
      expect(console.info).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.arrayContaining(extraParam));
    });

    it('should be disabled when specified', () => {
      logger.enabled = false;

      logger.info(message);
      expect(console.info).not.toHaveBeenCalled();
    });
  });

  describe('Warn', () => {
    it('should write to console as warn', () => {
      logger.warn(message);
      expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything());
    });

    it('should write to console all parameters', () => {
      logger.warn(message, extraParam);
      expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.arrayContaining(extraParam));
    });

    it('should be disabled when specified', () => {
      logger.enabled = false;

      logger.warn(message);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Error', () => {
    it('should write to console as error', () => {
      logger.error(message);
      expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything());
    });

    it('should write to console all parameters', () => {
      logger.error(message, extraParam);
      expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(message),
        jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.arrayContaining(extraParam));
    });

    it('should be disabled when specified', () => {
      logger.enabled = false;

      logger.error(message);
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  it('#isEnabled should return if logger is enabled', () => {
    expect(logger.isEnabled).toBe(true);
  });

  it('#enabled should enable or disable the logger', () => {
    logger.enabled = false;
    expect(logger.isEnabled).toBe(false);

    logger.enabled = true;
    expect(logger.isEnabled).toBe(true);
  });
});
