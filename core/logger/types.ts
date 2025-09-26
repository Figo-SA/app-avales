export interface BaseLogDto {
  event?: string;
  msg: string;
  data?: any;
}

export interface ErrorLogDto extends BaseLogDto {
  err: any;
}

export interface BaseLogger {
  debug(msg: string, data?: any): void;
  info(msg: string, data?: any): void;
  warn(msg: string, data?: any): void;
  error(msg: string, err?: any, data?: any): void;
}
