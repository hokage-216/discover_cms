import { Sequelize } from "sequelize";
import 'dotenv/config';

const URI = process.env.MYSQLURI;

const sequelize = new Sequelize(URI);

export default sequelize;