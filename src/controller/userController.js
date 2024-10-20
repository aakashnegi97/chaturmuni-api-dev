
const ApiResponse = require("../utils/responseHelper");
const { User } = require("../model/index");
const { Op } = require("sequelize");
const { createToken } = require("../utils/jwt");
const bcrypt = require("../utils/bcrypt");

exports.isLogin = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    try {
        const { id, name, email, phone, customer_number, iat, exp } = req.user;

        const user = await User.findOne({
            where: {
                [Op.or]: {
                    id
                }
            },
            attributes: ["id", "customer_number", "name", "email", "phone", "address", "pincode", "referral_code", "reward_point"]
        });

        if (!user?.dataValues) {
            apiResponse.setError("User not found.", 404)
            apiResponse.send()
            return
        }


        apiResponse.message = "Success!";
        apiResponse.setData(user)
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

exports.refreshToken = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    try {
        const { id, name, email, phone, customer_number, iat, exp } = req.user;

        const token = createToken({
            id,
            name,
            email,
            phone,
            customer_number
        }, process.env.JWT_SECRET)
        apiResponse.message = "Refresh token success.";
        apiResponse.setData(token)
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

exports.resetPassword = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    try {
        const { id, name, email, phone, customer_number, iat, exp } = req.user;

        const { newPassword } = req.body;

        const hashedPassword = await bcrypt.hashPassword(newPassword)
        if (!hashedPassword.success) {
            apiResponse.setError(hashedPassword.msg, 500)
            apiResponse.send()
            return
        }

        const [updatedRows] = await User.update({ password: hashedPassword.hash }, { where: { email }, });
        if (updatedRows == 0) {
            apiResponse.setError("Failed to reset password.", 500)
            apiResponse.send()
            return
        }

        apiResponse.message = "Password reset success!";
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