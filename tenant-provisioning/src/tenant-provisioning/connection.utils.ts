import * as mysql from 'mysql2';
import { ConfigService } from '@nestjs/config';
import Connection from 'mysql2/typings/mysql/lib/Connection';

export const ConnectionUtils = {
  getConnection: function (config: ConfigService) {
    const DbConnection = mysql.createConnection({
      host: config.get('tenantdb.host'),
      port: config.get('tenantdb.port'),
      user: config.get('db.username'),
      password: config.get('db.password'),
      multipleStatements: true,
    });
    DbConnection.connect((err) => {
      if (err) {
        console.log(`Error while connecting to db server: ${err}`);
        throw err;
      }
      console.log('connected');
    });

    return DbConnection;
  },

  endConnection: function (DbConnection: Connection) {
    DbConnection.end((err) => {
      if (err) {
        console.log(`Error while ending connection from db server: ${err}`);
        throw err;
      }
      console.log('connection ended');
    });
  },
};
