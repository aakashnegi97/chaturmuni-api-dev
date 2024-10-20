const { Model, DataTypes } = require('sequelize');

class ReferralPointTransaction extends Model {
    static initModel(sequelize) {
        ReferralPointTransaction.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user', // Reference to the User model
                    key: 'id',
                },
            },
            amount: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            is_deposit: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            available_amount: {
                type: DataTypes.BIGINT,
                allowNull: false, // Change this to true if it can be nullable
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'referralPointTransaction',
            tableName: 'referral_point_transaction', // Explicitly set the table name
            timestamps: false, // Disable automatic timestamp fields
            hooks: {
                beforeCreate: (transaction) => {
                    transaction.created_at = new Date();
                },
            },
        });
    }

    static associate(models) {
        ReferralPointTransaction.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    }
}

module.exports = ReferralPointTransaction;
