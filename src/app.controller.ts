import { Controller, Body, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  public async getHello(@Res() res:Response) {
    let result:string = null;
    await this.appService.getHello().then((value) => {
      res.send(JSON.stringify(value))
    })
  }    
}

// let result:string = null;
// await this.appService.getHello().then((value) => {
//   result = value.toString();
// });
// return result;
