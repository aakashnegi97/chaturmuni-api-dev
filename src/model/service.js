const { Model, DataTypes } = require('sequelize');

class Service extends Model {
    static initModel(sequelize) {
        Service.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            service_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            service_description: {
                type: DataTypes.STRING,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            modelName: 'service',
            tableName: 'service',
            timestamps: false, // Set to true if you want Sequelize to handle createdAt/updatedAt automatically
            hooks: {
                beforeCreate: (service) => {
                    service.created_at = new Date();
                    service.updated_at = new Date();
                },
                beforeUpdate: (service) => {
                    service.updated_at = new Date();
                },
            },
        });
    }

    static associate(models) {
        Service.hasMany(models.Plan, {
            foreignKey: 'service_id',
            as: 'plans',
        });
    }
}

module.exports = Service;
