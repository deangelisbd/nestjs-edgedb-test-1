import { Controller, Body, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get('/edge')
  public async edgeQuery(@Req() req:Request, @Res() res:Response) {
    const query:string = req.query.query.toString()
    await this.appService.edgeQL(query).then((value) => {
      res.json(value)
    })
  }    
}

// let result:string = null;
// await this.appService.getHello().then((value) => {
//   result = value.toString();
// });
// return result;
