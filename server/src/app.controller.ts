import { Controller, Body, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get('/')
  public async alive(@Req() req:Request, @Res() res:Response) {
    res.send('OK')
  }    

  @Get('/edge')
  public async edgeQuery(@Req() req:Request, @Res() res:Response) {
    const query:string = req.query.query.toString()
    await this.appService.edgeQL(query).then((value) => {
      res.json(value)
    }, (reason) => {
      console.log(reason)
      res.status(500).json( { message: reason.toString() } )
    })
  }    
}

// let result:string = null;
// await this.appService.getHello().then((value) => {
//   result = value.toString();
// });
// return result;
