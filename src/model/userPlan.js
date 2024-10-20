const { Model, DataTypes } = require('sequelize');

class UserPlan extends Model {
    static initModel(sequelize) {
        UserPlan.init({
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
            plan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'plan', // Reference to the Plan model
                    key: 'id',
                },
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'order', // Reference to the Order model
                    key: 'id',
                },
            },
            validity_start: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            validity_end: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'expired'), // Enum for status
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'userPlan',
            tableName: 'user_plan', // Explicitly set the table name
            timestamps: false,
            hooks: {
                beforeCreate: (userPlan) => {
                    userPlan.created_at = new Date();
                    userPlan.updated_at = new Date();
                },
                beforeUpdate: (userPlan) => {
                    userPlan.updated_at = new Date();
                },
            },
        });
    }

    static associate(models) {
        UserPlan.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
        UserPlan.belongsTo(models.Plan, {
            foreignKey: 'plan_id',
            as: 'plan',
        });
        UserPlan.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order',
        });
    }
}

module.exports = UserPlan;
