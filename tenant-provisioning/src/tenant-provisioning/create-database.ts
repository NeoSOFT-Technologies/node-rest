import * as mysql from 'mysql2';
import { ConfigService } from '@nestjs/config';

export const getConnection = (config: ConfigService) => {
  const db_connection = mysql.createConnection({
    host: config.get('db.host'),
    user: config.get('db.username'),
    password: config.get('db.password'),
    multipleStatements: true,
  });
  db_connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('connected');
  });

  return db_connection;
};
