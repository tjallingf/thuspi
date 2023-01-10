const LogController = require('@controllers/LogController');

class LogManager {
    debug(message) {
        LogController.write('debug', message);
    }

    error(message) {
        LogController.write('error', message);
        return new Error(message);
    }

    info(message) {
        LogController.write('info', message);
    }

    success(message) {
        LogController.write('success', message);
    }

    warn(message) {
        LogController.write('warn', message);
    }
}

module.exports = LogManager;