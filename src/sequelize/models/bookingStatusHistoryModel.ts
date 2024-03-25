import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '..';

export const BookingStatusHistory = sequelize.define('BookingStatusHistory', {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});
