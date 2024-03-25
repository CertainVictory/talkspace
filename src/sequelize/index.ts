import { Sequelize, DataTypes } from 'sequelize';
import { Booking } from './models/bookingModel';
import { BookingStatusHistory } from './models/bookingStatusHistoryModel';
import { Credit } from './models/creditModel';
import { User } from './models/userModel';

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

const modelDefiners: any[] = [Booking, BookingStatusHistory, Credit, User];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyAssociations(sequelize);

export default sequelize;
