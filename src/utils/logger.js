import winston, { createLogger } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'silly',
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => `[${level}]: ${message}`)
  )
})


export default logger;