const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'node',
    database: 'node-shopping-project',
    password: 'node-password'
});

module.exports=pool.promise();