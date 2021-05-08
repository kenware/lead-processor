import winston from 'winston';

const { format } = winston;

const logFormat = format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(),
    format.splat(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat,
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: format.combine(
        format.json(),
      ),
    }),
  ],
});

export default logger;
