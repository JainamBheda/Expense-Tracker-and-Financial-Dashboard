import { initSequelize } from '../config/database.js';
import defineUserModel from './User.js';
import defineTransactionModel from './Transaction.js';

const sequelize = initSequelize();

const User = defineUserModel(sequelize);
const Transaction = defineTransactionModel(sequelize);

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Transaction };



