import { Request, Response } from 'koa';
import { v4 } from 'uuid';
import { LoggingContext } from './types';
import pino, { Logger } from 'pino';

export class AppLogger{
  public context: LoggingContext
  private logger: Logger

  log = () => {
    this.logger.info(this.context);
  }
  info = () => {
    this.logger.info(this.context);
  }
  setMessage = (message: string) => {
    this.context.message = message;
  }
  setResponse = (res: Response) => {
    this.context.response = res;
  }  
  constructor(request: Request){
    this.context = {
      request:{
        id: v4(),
        ip:request.ip,
      },
      response:{},
      level:'debug',
    };
    this.logger = pino({
      prettyPrint:true
    });
  }
  
}

