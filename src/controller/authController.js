
const ApiResponse = require("../utils/responseHelper");
const nodeMailer = require("../utils/nodemailer");
const smsHandler = require("../utils/sms");
const otpHandler = require("../utils/otpHandler");
const bcrypt = require("../utils/bcrypt");
const { User } = require("../model/index");
const { Op } = require("sequelize");
const { generateUniqueId } = require("../utils/uniqueCodeGenerator");
const { createToken } = require("../utils/jwt");

exports.sendEmailOtp = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    const { email } = req.body;
    const otpResponse = otpHandler.storeOtp(email);
    console.log(otpResponse)
    if (!otpResponse?.status) {
        return apiResponse.setError(otpResponse.msg, 500).send();
    }

    try {
        const mailResponse = await nodeMailer.sendEmail(email, "OTP", otpResponse.otp.otp);
        apiResponse.message = "OTP sent.";
        apiResponse.send();
    } catch (err) {
        console.log("Error Message: ", err)
        otpHandler.deleteOtp(email)
        apiResponse.setError("", err.statusCode || 500).send();
    }
}

exports.sendPhoneOtp = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    const { phone } = req.body;
    const otpResponse = otpHandler.storeOtp(phone);
    console.log(otpResponse)
    if (!otpResponse?.status) {
        return apiResponse.setError(otpResponse.msg, 500).send();
    }

    try {
        const mailResponse = await smsHandler.sendSms(phone, "Message");
        apiResponse.message = "Sms sent.";
        apiResponse.send();
    } catch (err) {
        console.log("Error Message: ", err)
        otpHandler.deleteOtp(phone)
        apiResponse.setError("", err.statusCode || 500).send();
    }
}

exports.signup = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    const { email, emailOtp, phone, phoneOtp, name, password, address, pincode } = req.body;

    try {
        const emailOtpRes = otpHandler.validateOtp(email, emailOtp);
        if (!emailOtpRes.isValid) {
            apiResponse.setError(emailOtpRes.msg, 401)
            apiResponse.send()
            return
        }
        // const phoneOtpRes = otpHandler.validateOtp(phone, phoneOtp);
        // if (!phoneOtpRes.isValid) {
        //     apiResponse.setError(phoneOtpRes.msg, 401)
        //     apiResponse.send()
        //     return
        // }

        const existingUser = await User.findAll({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if (existingUser?.length > 0) {
            apiResponse.setError("Email or Phone number already taken.", 409)
            apiResponse.send()
            return
        }

        const hashedPassword = await bcrypt.hashPassword(password)
        if (!hashedPassword.success) {
            apiResponse.setError(hashedPassword.msg, 500)
            apiResponse.send()
            return
        }

        console.log("hashedPassword: ", hashedPassword)

        const user = await User.create({
            name,
            customer_number: generateUniqueId(5),
            referral_code: generateUniqueId(5),
            address,
            pincode,
            email,
            password: hashedPassword.hash,
            phone
        });

        console.log("Response: ", user)

        apiResponse.message = "User created successfully!";
        // apiResponse.setData(user)
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
            apiResponse.setError("", err.statusCode || 500)
        }
        apiResponse.send();
    }
}

exports.signin = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    const { account, password } = req.body;

    try {

        const user = await User.findOne({
            where: {
                [Op.or]: {
                    email: account || "",
                    phone: account || ""
                }
            },
            attributes: ["id", "customer_number", "name", "email", "phone", "address", "pincode", "referral_code", "reward_point", "password"]
        });

        if (!user?.dataValues) {
            apiResponse.setError("User not found.", 404)
            apiResponse.send()
            return
        }

        const isMatch = await bcrypt.comparePassword(password, user?.dataValues?.password)
        if (!isMatch) {
            apiResponse.setError("Incorrect credentials.", 401)
            apiResponse.send()
            return
        }

        if (user?.dataValues?.password)
            delete user.dataValues["password"]

        const token = createToken({
            id: user?.dataValues?.id,
            name: user?.dataValues?.name,
            email: user?.dataValues?.email,
            phone: user?.dataValues?.phone,
            customer_number: user?.dataValues?.customer_number
        }, process.env.JWT_SECRET)
        user.dataValues.token = token;

        apiResponse.message = "Login success!";
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

exports.forgotPassword = async (req, res) => {

    const apiResponse = new ApiResponse(res);

    const { email, emailOtp, newPassword } = req.body;

    try {

        const user = await User.findOne({
            where: {
                [Op.or]: {
                    email: email || "",
                }
            },
            attributes: ["id", "customer_number", "name", "email", "phone", "address", "pincode", "referral_code", "reward_point"]
        });

        if (!user?.dataValues) {
            apiResponse.setError("User not found.", 404)
            apiResponse.send()
            return
        }

        const emailOtpRes = otpHandler.validateOtp(email, emailOtp);
        if (!emailOtpRes.isValid) {
            apiResponse.setError(emailOtpRes.msg, 401)
            apiResponse.send()
            return
        }

        const hashedPassword = await bcrypt.hashPassword(newPassword)
        if (!hashedPassword.success) {
            apiResponse.setError(hashedPassword.msg, 500)
            apiResponse.send()
            return
        }

        const [updatedRows] = await User.update({ password: hashedPassword.hash }, { where: { email }, });
        if (updatedRows == 0) {
            apiResponse.setError("Failed to update password.", 500)
            apiResponse.send()
            return
        }

        apiResponse.message = "Password update success!";
        // apiResponse.setData(user)
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