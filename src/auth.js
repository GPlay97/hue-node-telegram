/**
 * @file auth.js
 * @author GPlay97
 * @description Auth module to validate password from request and compare the hashed password with the hashed password specified in config file
 */
const passwordHash = require('password-hash'),
    srv_config = require('./../config.json'),
    errors = require('./errors.json');

module.exports = {
    /**
     * Validates password from the given one in request with the password hash specified within config file (generated from authentication.js script)
     * @param {Object} req the server request
     * @param {Object} res the server response
     */
    validatePassword: (req, res) => {
        if (typeof req.body.password === 'string') {
            // hash password and compare with the one from config
            if (passwordHash.verify(req.body.password, srv_config.AUTHORIZED_HASH)) {
                // password matches
                res.json({
                    authorized: (req.session.authenticated = true)
                });
            } else {
                // does not match - invalid credentials
                res.status(401).json({
                    error: {
                        code: errors.INVALID_CREDENTIALS.code,
                        message: errors.INVALID_CREDENTIALS.message
                    }
                });
            }
        } else {
            // password parameter is missing or invalid type
            res.status(422).json({
                error: {
                    code: errors.MISSING_PARAMETERS.code,
                    message: errors.MISSING_PARAMETERS.message
                }
            });
        }
    }
};