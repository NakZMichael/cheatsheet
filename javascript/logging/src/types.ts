export interface LoggingContext{
  message?: string,
  request: {
    id: string,
    ip: string,
  },
  level: 'trace'|'debug'|'info'|'warn'|'error'|'fatal',
  response?: any,
  error?: Error,
}
