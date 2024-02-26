const { Sequelize } = require('sequelize')

const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_HOST
} = process.env;

if( !POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_PORT || !POSTGRES_HOST ) {
  throw new Error('Not all environment variables provided');
}

const sequelizeConfig = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  dialect: 'postgres',
});

module.exports = sequelizeConfig