import { Controller, Body, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {

  logger: Logger;

  constructor(private readonly appService: AppService) {
    this.logger = new Logger();
  }

  @Get('/')
  public async alive(@Req() req:Request, @Res() res:Response) {
    res.send('OK')
  }    

  @Get('/edge')
  public async edgeQuery(@Req() req:Request, @Res() res:Response) {
    const query:string = req.query.query.toString()
    this.logger.debug('Running EdgeQL query: ' + query)
    await this.appService.edgeQL(query).then((value) => {
      this.logger.debug('EdgeDB query successful!')
      res.json(value)
    }, (reason) => {
      this.logger.warn('Query failed:' + reason)
      res.status(500).json( { message: reason.toString() } )
    })
  }    
}

// let result:string = null;
// await this.appService.getHello().then((value) => {
//   result = value.toString();
// });
// return result;
