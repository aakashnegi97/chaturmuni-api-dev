
const ApiResponse = require("../utils/responseHelper");
const nodeMailer = require("../utils/nodemailer");
const smsHandler = require("../utils/sms");
const bcrypt = require("../utils/bcrypt");
const { Master } = require("../model/index");
const { Op } = require("sequelize");
const { createToken } = require("../utils/jwt");

exports.signin = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    const { adminName, adminPassword } = req.body;

    try {

        const admin = await Master.findOne({
            where: {
                [Op.or]: {
                    admin_name: adminName || "",
                    admin_password: adminPassword || ""
                }
            },
        });

        if (!admin?.dataValues) {
            apiResponse.setError("Admin not found.", 404)
            apiResponse.send()
            return
        }

        const isMatch = await bcrypt.comparePassword(adminPassword, admin?.dataValues?.admin_password)
        if (!isMatch) {
            apiResponse.setError("Incorrect credentials.", 401)
            apiResponse.send()
            return
        }

        if (admin?.dataValues?.admin_password)
            delete admin.dataValues["admin_password"]

        const token = createToken({
            id: admin?.dataValues?.id,
            admin_name: admin?.dataValues?.admin_name,
        }, process.env.JWT_ADMIN_SECRET)
        admin.dataValues.token = token;

        apiResponse.message = "Login success!";
        apiResponse.setData(admin)
        apiResponse.send();
    } catch (err) {
        console.log("Error Message: ", err)

        if (err?.errors && err?.errors?.length) {
            let errors = [];
            err.errors.map(item => {
                if (item?.message) {
                    errors.push(item?.message)
                }
            })
            apiResponse.setError(errors?.length ? errors : "", err.statusCode || 500)
        } else {
            apiResponse.setError("", err?.statusCode || 500)
        }
        apiResponse.send();
    }
}