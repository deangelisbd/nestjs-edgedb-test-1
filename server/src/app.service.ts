import { Injectable } from '@nestjs/common';
import * as edgedb from 'edgedb';

//edgedb --dsn=edgedb://edgedb@localhost:5656/edgedb --tls-security=insecure

@Injectable()
export class AppService {
  async getHello() {
    const client = edgedb.createClient({
      dsn: 'edgedb://edgedb@edgedb:5656/edgedb?tls_security=insecure'
    });
    const result = query(client)
    return result;
  }
}

async function query(client: edgedb.Client) {
  const result = await client.query('select Movie { title, year };')
  return result;
}