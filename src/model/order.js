const { Model, DataTypes } = require('sequelize');

class Order extends Model {
    static initModel(sequelize) {
        Order.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_plan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user_plan', // Reference to the UserPlan model
                    key: 'id',
                },
            },
            transaction_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'transaction', // Reference to the Transaction model
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.ENUM('pending', 'completed', 'failed'), // Enum for status
                allowNull: false,
            },
            amount: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            amount_breakdown: {
                type: DataTypes.JSON, // Field to store JSON data
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'order',
            tableName: 'order', // Explicitly set the table name
            timestamps: false,
            hooks: {
                beforeCreate: (order) => {
                    order.created_at = new Date();
                    order.updated_at = new Date();
                },
                beforeUpdate: (order) => {
                    order.updated_at = new Date();
                },
            },
        });
    }

    static associate(models) {
        Order.belongsTo(models.UserPlan, {
            foreignKey: 'user_plan_id',
            as: 'userPlan',
        });
        Order.belongsTo(models.Transaction, {
            foreignKey: 'transaction_id',
            as: 'transaction',
        });
    }
}

module.exports = Order;
