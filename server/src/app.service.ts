import { Injectable } from '@nestjs/common';
import * as edgedb from 'edgedb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {}

  async edgeQL(query: string) {
    const client = edgedb.createClient({
      dsn: 'edgedb://' + this.configService.get('EDGE_USER') + ':' + this.configService.get('EDGE_PASSWORD') + '@' + this.configService.get('EDGE_HOST') + ':' + this.configService.get('EDGE_PORT') + '/' + this.configService.get('EDGE_DB') + '?tls_security=insecure'
    });
    const result = await client.query(query)
    return result;
  }

  protected getConfig = (prop:string):string | undefined => {
    return this.configService.get(prop)
  }
}