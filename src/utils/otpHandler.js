
class OTP {
    constructor() {
        // Generate a random OTP (6-digit)
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otpValue;
        this.isExpired = false;
    }

    expire() {
        this.isExpired = true;
    }
}

const otpStore = {};

const expiryTime = 5 * 60 * 1000; //  Expire OTP in 5 minutes
const deleteOtpTime = 2 * 60 * 1000; //  Expire OTP in 5 minutes



const storeOtp = (key) => {
    if (otpStore[key]) {
        if (!otpStore[key].isExpired) {
            return { msg: "OTP already sent.", status: false }
        }
    }
    const otp = new OTP();
    otpStore[key] = otp;
    setTimeout(() => {
        otp.expire(); // Mark OTP as expired after expiryTime
        setTimeout(() => {
            delete otpStore[key]
        }, deleteOtpTime)
    }, expiryTime);
    return { msg: "OTP generated.", status: true, otp: otp }
}

const deleteOtp = (key) => {
    delete otpStore[key]
}

const validateOtp = (key, otp) => {
    const result = {
        isValid: false,
        msg: ""
    }

    if (!key || !otp) {
        result.msg = "Invalid data found."
    } else if (otpStore[key]) {
        const otpObj = otpStore[key];
        if (otpObj.isExpired) {
            result.msg = "OTP expired."
        } else {
            if (otpObj.otp === otp) {
                result.msg = "OTP verified."
                result.isValid = true
            } else {
                result.msg = "Incorrect OTP."
            }
        }
    } else {
        result.msg = `OTP not found for ${key}.`
    }

    return result
}

module.exports = {
    storeOtp,
    deleteOtp,
    validateOtp
};