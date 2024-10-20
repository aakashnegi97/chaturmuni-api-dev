const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            customer_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
            },
            pincode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_sign_in: {
                type: DataTypes.DATE,
            },
            sign_in_count: {
                type: DataTypes.BIGINT,
                defaultValue: 0,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            referral_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            reward_point: {
                type: DataTypes.BIGINT,
                defaultValue: 0,
            },
        }, {
            sequelize,
            modelName: 'user',
            tableName: 'user',
            timestamps: false, // Set this to true if you want Sequelize to handle createdAt/updatedAt automatically
            indexes: [
                {unique:true, fields:['customer_number']},
                {unique:true, fields:['email']},
                {unique:true, fields:['phone']},
                {unique:true, fields:['referral_code']},
            ],
            hooks: {
                beforeCreate: (user) => {
                    user.created_at = new Date();
                    user.updated_at = new Date();
                },
                beforeUpdate: (user) => {
                    user.updated_at = new Date();
                },
            },
        });
    }
}

module.exports = User;
