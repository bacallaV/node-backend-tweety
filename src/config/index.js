const { Sequelize } = require('sequelize')

const {
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_HOST
} = process.env;

if( !DATABASE_NAME || !DATABASE_USERNAME || !DATABASE_PASSWORD || !DATABASE_PORT || !DATABASE_HOST ) {
  throw new Error('Not all environment variables provided');
}

const sequelizeConfig = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: 'postgres',
});

module.exports = sequelizeConfig