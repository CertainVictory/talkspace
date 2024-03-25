import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '..';

// Define the Booking model
export const Booking = sequelize.define('Booking', {
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString(),
    },
  },
  patient: {
    type: DataTypes.STRING,
    allowNull: true, // Allow anonymous bookings
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Default status
    validate: {
      isIn: [['pending', 'confirmed', 'recheduled', 'canceled']],
    },
  },
  credit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
