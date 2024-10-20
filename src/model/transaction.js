const { Model, DataTypes } = require('sequelize');

class Transaction extends Model {
    static initModel(sequelize) {
        Transaction.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'order', // Reference to the Order model
                    key: 'id',
                },
            },
            amount: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'completed', 'failed'), // Enum for status
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'transaction',
            tableName: 'transaction', // Explicitly set the table name
            timestamps: false,
            hooks: {
                beforeCreate: (transaction) => {
                    transaction.created_at = new Date();
                },
            },
        });
    }

    static associate(models) {
        Transaction.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order',
        });
    }
}

module.exports = Transaction;
