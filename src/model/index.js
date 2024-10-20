const { Sequelize } = require('sequelize');
const Service = require('./service');
const User = require('./user');
const Plan = require('./plan');
const UserPlan = require('./userPlan');
const Order = require('./order');
const Transaction = require('./transaction');
const ReferralPointTransaction = require('./referralPointTransaction');
const Master = require('./master');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT
});



User.initModel(sequelize);
Plan.initModel(sequelize);
Service.initModel(sequelize);
UserPlan.initModel(sequelize);
Order.initModel(sequelize);
Transaction.initModel(sequelize);
ReferralPointTransaction.initModel(sequelize);
Master.initModel(sequelize);

// Define associations

Service.associate({ Plan });
Plan.associate({ Service });
UserPlan.associate({ User, Plan, Order });
Order.associate({ UserPlan, Transaction });
Transaction.associate({ Order });
ReferralPointTransaction.associate({ User });

module.exports = { sequelize, User, Service, Plan, UserPlan, Order, Transaction, Master };
