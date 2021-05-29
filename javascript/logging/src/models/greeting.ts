import { AppLogger } from '../logger';

export class Greeting{
  logger: AppLogger

  constructor(logger: AppLogger){
    this.logger = logger;
  }

  greeting(){
    this.logger.log();
  }
  async lazyGreeting(){
    await sleep(1000);
    this.logger.log();
    
  }
}

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
