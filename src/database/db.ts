import { Sequelize, DataTypes } from 'sequelize';

// Create a single persistent MySQL database connection pool
const sequelize = new Sequelize(
  process.env.DATABASE_NAME || '',
  process.env.DATABASE_USER || '',
  process.env.DATABASE_PW || '',
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql', // Use the appropriate database dialect
    logging: false, // Disable logging SQL queries (you can enable it for debugging)
  }
);

export default sequelize;
