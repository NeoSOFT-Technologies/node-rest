import * as mysql from 'mysql2';

export const db_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true
})
db_connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('connected')
});