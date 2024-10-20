const { validationResult } = require('express-validator');

const commonValidator = (
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation error');
            error.statusCode = 400;
            error.errors = errors.array();
            return next(error);
        }
        next();
    }
)

module.exports = commonValidator;