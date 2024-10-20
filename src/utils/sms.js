

const sendSms = (to, text) => new Promise(async (resolve, reject) => {
    const smsOptions = {
        to: to,
        text: text,
    };

    try {
        const info = {
            status: true
        }
        resolve(info)
    } catch (error) {
        reject(error)
    }
})

module.exports = { sendSms };