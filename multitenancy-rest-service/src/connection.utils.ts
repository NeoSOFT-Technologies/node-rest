import * as mysql from 'mysql2';
import { ConfigService } from '@nestjs/config';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import { DbDetailsDto } from './dto/db.details.dto';

export const ConnectionUtils = {
  getConnection: async function (dbDetails: DbDetailsDto) {
    const db_connection = mysql.createConnection({
      host: dbDetails.host,
      port: dbDetails.port,
      user: dbDetails.tenantName,
      password: dbDetails.password,
      database: dbDetails.dbName,
    });

    const connection = new Promise((res) => {
      db_connection.connect((err) => {
        if (err) {
          res(err);
        }
        else {
          res({ Message: 'Database connected successfuly' });
        }
      });
    })
    return new Promise(async (res) => {
      res(await connection);
    })
  },

  endConnection: function (db_connection: Connection) {
    db_connection.end((err) => {
      if (err) {
        throw err;
      }
      console.log('connection ended');
    });
  },
};
