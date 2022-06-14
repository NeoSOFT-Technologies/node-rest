import * as mysql from 'mysql2';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import { DbDetailsDto } from '@app/dto';

export const ConnectionUtils = {
  getConnection: async function (dbDetails: DbDetailsDto) {
    const DbConnection = mysql.createConnection({
      host: dbDetails.host,
      port: dbDetails.port,
      user: dbDetails.tenantName,
      password: dbDetails.password,
      database: dbDetails.dbName,
    });

    const connection = new Promise((res) => {
      DbConnection.connect((err) => {
        if (err) {
          res(err);
        }
        else {
          res({ Message: 'Database connected successfuly' });
        }
      });
    })
    return Promise.resolve(await connection);
  },

  endConnection: function (DbConnection: Connection) {
    DbConnection.end((err) => {
      if (err) {
        throw err;
      }
      console.log('connection ended');
    });
  },
};
