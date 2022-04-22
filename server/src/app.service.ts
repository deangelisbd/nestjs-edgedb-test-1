import { Injectable } from '@nestjs/common';
import * as edgedb from 'edgedb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {}

  async getHello() {
    const configService = this
    const client = edgedb.createClient({
      dsn: 'edgedb://' + this.configService.get('EDGE_USER') + '@' + this.configService.get('EDGE_HOST') + ':' + this.configService.get('EDGE_PORT') + '/' + this.configService.get('EDGE_DB') + '?tls_security=insecure'
    });
    const result = query(client)
    return result;
  }
}

async function query(client: edgedb.Client) {
  const result = await client.query('select Movie { title, year };')
  return result;
}