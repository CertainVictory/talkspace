import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db';

// Define the Credit model
export const Credit = sequelize.define('Credit', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString(),
    },
  },
});
