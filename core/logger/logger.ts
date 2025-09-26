/* eslint-disable no-console */
import type { BaseLogger } from "./types";

interface LoggerOptions {
  name: string;
}

export class ReactNativeLogger implements BaseLogger {
  private readonly name: string;

  constructor(options: LoggerOptions) {
    this.name = options.name;
  }

  private formatLog(level: string, msg: string, data?: any) {
    return JSON.stringify({
      level,
      time: new Date().toISOString(),
      name: this.name,
      msg,
      data,
    });
  }

  private shouldLog(level: string): boolean {
    if (__DEV__) return true;
    return level !== "debug"; // debug no se muestra en producción
  }

  debug(msg: string, data?: any) {
    if (!this.shouldLog("debug")) return;
    console.debug(this.formatLog("debug", msg, data));
  }

  info(msg: string, data?: any) {
    if (!this.shouldLog("info")) return;
    console.info(this.formatLog("info", msg, data));
  }

  warn(msg: string, data?: any) {
    if (!this.shouldLog("warn")) return;
    console.warn(this.formatLog("warn", msg, data));
  }

  error(msg: string, err?: any, data?: any) {
    console.error(
      this.formatLog("error", msg, { ...data, err: err?.message || err })
    );

    if (!__DEV__) {
      // Aquí puedes enviar errores a Crashlytics, Sentry, Datadog, etc.
      // crashlytics().recordError(err);
    }
  }
}
