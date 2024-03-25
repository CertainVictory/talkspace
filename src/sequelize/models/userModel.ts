import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db';

// Define the Credit model
export const User = sequelize.define('User', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['provider', 'patient']],
    },
  },
});
