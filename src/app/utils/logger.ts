import * as debug from 'debug';

import { environment } from '../../environments/environment';

export class Logger {
  private enable: boolean;
  private l: debug.IDebugger;
  private d: debug.IDebugger;
  private i: debug.IDebugger;
  private w: debug.IDebugger;
  private e: debug.IDebugger;

  static create(name: string): Logger {
    return new Logger(name);
  }

  constructor(name: string) {
    const namespace = `nekoro:${name}`;

    debug.enable(namespace);

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

  log(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.l(msg, ...extra) : this.l(msg);
    }
  }

  debug(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.d(msg, ...extra) : this.d(msg);
    }
  }

  info(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.i(msg, ...extra) : this.i(msg);
    }
  }

  warn(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.w(msg, ...extra) : this.w(msg);
    }
  }

  error(msg: string, ...extra: any[]): void {
    if (this.enable) {
      extra.length > 0 ? this.e(msg, ...extra) : this.e(msg);
    }
  }

  get isEnabled(): boolean {
    return this.enable;
  }

  set enabled(enable) {
    this.enable = enable;
  }
}
