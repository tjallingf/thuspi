const { createLogger, addColors, format, transports } = require('winston');
const { combine, errors, simple, colorize, timestamp, printf } = format;
const _ = require('lodash');

const consoleFormatter = printf((info, opts) => {
    if(typeof info.label != 'string') 
        info.label = 'System';

    let message = `${info.timestamp} [${info.label}] ${info.level}`;

    if(info.stack) {
        message += ': '+info.stack.substring(_.trimStart(info.stack, 'Error: ') + 7);
    } else {
        message += ': '+_.trimEnd(info.message, '.')+'.';
    }
    if(info.meta) message += ' '+JSON.stringify(info.meta);
    
    return message;
})

const splitMeta = format((info, opts) => {
    const nonMetaProperties = [ 'level', 'message', 'label', 'timestamp', 'stack' ];
    const meta = _.omit(info, nonMetaProperties);

    return {
        ..._.pick(info, nonMetaProperties),
        meta: Object.keys(meta).length ? meta : null
    }
})

const ajvErrors = format((info, opts) => {
    const err = (info.meta ? info.meta['0'] : null);
    const isAjvError = (
        _.isPlainObject(err) && 
        typeof err.instancePath == 'string' && 
        typeof err.schemaPath == 'string');

    if(isAjvError) {
        const keypath = _.trimStart(err.instancePath, '/').replaceAll('/', '.');
        info.message = _.trimEnd(info.message, ' ')+' ';
        if(keypath) info.message += `property '${keypath}' `;
        info.message += err.message;
    }

    return info;
})

const logger = createLogger({
    level: 'debug',
    levels: { error: 0, warn: 1, notice: 2, info: 3, debug: 4 },
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp({
                    format: 'HH:mm:ss.SSS'
                }),
                errors({ stack: true }),
                splitMeta(),
                ajvErrors(),
                consoleFormatter
            )
        })
    ]
})

addColors({
    info: 'green',
    debug: 'magenta',
    error: 'red',
    crit: 'bold red',
    warn: 'yellow',
    notice: 'blue'
});

module.exports = logger;