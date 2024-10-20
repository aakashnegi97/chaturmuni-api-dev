const { Model, DataTypes } = require('sequelize');

class Plan extends Model {
    static initModel(sequelize) {
        Plan.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            plan_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            service_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'service',
                    key: 'id',
                },
            },
            validity_months: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            price: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            details: {
                type: DataTypes.JSON,
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
            modelName: 'plan',
            tableName: 'plan',
            timestamps: false, // Set to true if you want Sequelize to handle createdAt/updatedAt automatically
            hooks: {
                beforeCreate: (plan) => {
                    plan.created_at = new Date();
                    plan.updated_at = new Date();
                },
                beforeUpdate: (plan) => {
                    plan.updated_at = new Date();
                },
            },
        });
    }

    static associate(models) {
        // Define association with Service
        Plan.belongsTo(models.Service, {
            foreignKey: 'service_id',
            as: 'service',
        });
    }
}

module.exports = Plan;
