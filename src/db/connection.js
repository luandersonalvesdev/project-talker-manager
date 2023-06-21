const mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
  host: process.env.MYSQL_HOSTNAME,
  port: 3306,
  password: 'password',
  database: 'TalkerDB',
  user: 'root',
});

module.exports = connection;