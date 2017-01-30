import { CodedError } from '../models/coded-error.model';

/**
 * @type {String[]} Registered namespaces of internal errors
 */
export const internalErrorNamespaces = [
  'user'
];

export class BaseError extends Error implements CodedError {
  code: string;
  message: string;

  constructor(code: string, message: string) {
    super();

    Object.defineProperty(this, 'name', {
      value: this.constructor.name
    });

    Object.defineProperty(this, 'code', {
      value: code
    });

    Object.defineProperty(this, 'message', {
      value: message
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
