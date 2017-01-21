import * as debug from 'debug';

import { environment } from '../../environments/environment';

export class Logger {
  private enable: boolean;
  private l: debug.IDebugger;
  private d: debug.IDebugger;
  private i: debug.IDebugger;
  private w: debug.IDebugger;
  private e: debug.IDebugger;

  /**
   * Creates a new Logger instance with passed parameters
   *
   * @param {string} name Name to extend the logger namespace
   * @param {boolean} force Force to display?
   * @returns {Logger} Logger instance configured with passed parameters
   */
  static create(name: string, force?: boolean): Logger {
    return new Logger(name, force);
  }

  constructor(name: string, force?: boolean) {
    const namespace = `nekoro:${name}`;

    if (force) {
      debug.enable(namespace);
    }

    this.enable = environment.debug;

    this.l = debug(namespace);
    this.d = debug(namespace);
    this.i = debug(namespace);
    this.w = debug(namespace);
    this.e = debug(namespace);

    this.l.log = console.log.bind(console);
    this.d.log = console.debug.bind(console);
    this.i.log = console.info.bind(console);
    this.w.log = console.warn.bind(console);
    this.e.log = console.error.bind(console);
  }

  /**
   * Displays message to console as log
   *
   * @param {string} msg Message to log
   * @param {...any} extra Extra parameters to log
   */
  log(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.l(msg, ...extra) : this.l(msg);
    }
  }

  /**
   * Displays message to console as debug
   *
   * @param {string} msg Message to log
   * @param {...any} extra Extra parameters to log
   */
  debug(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.d(msg, ...extra) : this.d(msg);
    }
  }

  /**
   * Displays message to console as info
   *
   * @param {string} msg Message to log
   * @param {...any} extra Extra parameters to log
   */
  info(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.i(msg, ...extra) : this.i(msg);
    }
  }

  /**
   * Displays message to console as warning
   *
   * @param {string} msg Message to log
   * @param {...any} extra Extra parameters to log
   */
  warn(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.w(msg, ...extra) : this.w(msg);
    }
  }

  /**
   * Displays message to console as error
   *
   * @param {string} msg Message to log
   * @param {...any} extra Extra parameters to log
   */
  error(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.e(msg, ...extra) : this.e(msg);
    }
  }

  /**
   * Returns the current status of logger
   *
   * @returns {boolean} Status of logger
   */
  get isEnabled(): boolean {
    return this.enable;
  }

  /**
   * Sets the current status of logger
   *
   * @param {boolean} enable
   */
  set enabled(enable: boolean) {
    this.enable = enable;
  }
}
