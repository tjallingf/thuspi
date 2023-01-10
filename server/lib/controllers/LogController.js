const Controller = require('@controllers/Controller');
const ConfigController = require('@controllers/ConfigController');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { parse: csvParse } = require('csv-parse');
const { stringify: csvStringify } = require('csv-stringify');
const StackTrace = require('stacktrace-js');

class LogController extends Controller {
    static findForDate(dt, max = 50) {
        return new Promise(async (resolve, reject) => {
            let messages = [];

            try {
                const fileMessages = await this.#readFile(this.#getFilepath(dt));
                messages.push(...fileMessages);
            } catch(err) {
                console.error(err);
            }

            messages.reverse();

            return resolve(messages.slice(0, Math.min(messages.length, max)));
        })
    }

    static #getFilepath(dt) {        
        const filename = [
            _.padStart(dt.getUTCFullYear()),
            _.padStart(dt.getUTCMonth()+1, 2, '0'),
            _.padStart(dt.getUTCDate(), 2, '0')
        ].join('-')+'.csv';

        return path.join(DIRS.STORAGE, 'log', filename);
    }

    static async #readFile(filepath) {
        return new Promise((resolve, reject) => {
            if(!fs.existsSync(filepath)) return reject();

            let messages = [];

            fs.createReadStream(filepath)
                .pipe(csvParse({ delimiter: ',', from_line: 1 }))
                .on('data', row => {
                    const [ time, source, levelChar, content ] = row;

                    messages.push({
                        level: this.#remapLevelChar(levelChar),
                        time: parseInt(time),
                        source: this.#remapSource(source),
                        content: content
                    });
                })
                .on('close', () => {
                    return resolve(messages);
                })

            return messages;
        })
    }

    static #remapLevelChar(levelChar) {
        return {
            s: 'success',
            i: 'info',
            d: 'debug',
            e: 'error',
            w: 'warn'
        }[levelChar] || 'info';
    }

    static #remapSource(sourceStr) {
        const [ type, name ] = sourceStr.split('/');
        return (name ? { type, name } : { type });
    }

    static #getSource(err) {
        const filepath = StackTrace.getSync()[2]?.fileName;

        if(filepath.startsWith(DIRS.EXTENSIONS)) {
            const [ extensionId, module, file ] = path.relative(DIRS.EXTENSIONS, filepath).split(path.sep);
            return `ext/${[extensionId, module, file].join('/')}`;
        }

        return 'lib';
    }

    static write(level, message) {
        const levelChar = _.trim(level).toLowerCase().substring(0, 1);
        
        switch(levelChar) {
            case 's': console.trace(message); break;
            case 'i': console.info(message); break;
            case 'd': console.debug(message); break;
            case 'e': console.error(message); break;
            case 'w': console.warn(message); break;
            default: 
                console.error(`Invalid log message level: '${level}'. Expected 'success', 'info', 'debug', 'error', or 'warn'.`) ;
        }

        const filepath = this.#getFilepath(new Date());

        const source = this.#getSource(new Error());

        csvStringify([
            [
                Math.round(Date.now() / 1000),
                source,
                levelChar,
                message
            ]
        ], (err, output) => {
            if (err) throw err;

            fs.appendFile(filepath, output, err => {
                if(err) throw err;
            })
        })

        return;
    }
}

module.exports = LogController;