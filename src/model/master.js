const { Model, DataTypes } = require('sequelize');
const bcrypt = require("../utils/bcrypt");

class Master extends Model {
    static initModel(sequelize) {
        Master.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            admin_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            admin_password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'master',
            tableName: 'master',
            timestamps: false, // Set this to true if you want Sequelize to handle createdAt/updatedAt automatically
            hooks: {
                beforeCreate: (master) => {
                    master.created_at = new Date();
                    master.updated_at = new Date();
                },
                beforeUpdate: (master) => {
                    master.updated_at = new Date();
                },
            },
        });
    }

    static async createIfNotExists() {
        const hashedPassword = await bcrypt.hashPassword(process.env.PASSWORD)
        if (!hashedPassword.success) {
            apiResponse.setError(hashedPassword.msg, 500)
            apiResponse.send()
            return
        }
        const [master, created] = await Master.findOrCreate({
            where: { admin_name: process.env.ADMIN, admin_password: hashedPassword.hash },
        });
        return { master, created };
    }
}



module.exports = Master;
