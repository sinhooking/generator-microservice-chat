const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logsPath = path.resolve('logs')

if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath)
}

const infoTransport = new winston.transports.File({
  filename: 'info.log',
  dirname: logsPath,
  level: 'info'
})

const errorTransport = new winston.transports.File({
  filename: 'error.log',
  dirname: logsPath,
  level: 'error'
})

const logger = winston.createLogger({
  transports: [infoTransport, errorTransport]
})

const stream = {
  write: message => {
    logger.info(message)
  }
}

module.exports = { logger, stream };