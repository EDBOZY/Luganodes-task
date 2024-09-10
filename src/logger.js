// logger.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'deposit-tracker.log' })
    ]
});

module.exports = logger;
