
exports.generateUniqueId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
    let timeConstrain = `${new Date().getTime()}`; // To maintain uniqueness
    for (let i = 0; i < (length); i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueId += characters[randomIndex];
    }
    uniqueId += `-${timeConstrain}`
    return uniqueId;
}