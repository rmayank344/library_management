require('dotenv').config();

module.exports = {
  development: {
    username: process.env.SQL_DATABASE_USERNAME,
    password: process.env.SQL_DATABASE_PASSWORD,
    database: process.env.SQL_DATABASE_NAME,
    host: process.env.SQL_DATABASE_HOST,
    dialect: 'mysql'
  }
};