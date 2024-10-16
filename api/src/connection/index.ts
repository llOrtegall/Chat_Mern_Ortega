import { Sequelize } from 'sequelize';

const NAME = process.env.DB_NAME!;
const USER = process.env.DB_USER!;
const PASS = process.env.DB_PASS!;
const HOST = process.env.DB_HOST!;
const PORT = process.env.DB_PORT!;

const dbConnection = new Sequelize(NAME, USER, PASS, {
  host: HOST,
  port: parseInt(PORT),
  dialect: 'mysql',
  timezone: '-05:00'
})

export { dbConnection };