const fs = require('fs');

const LOG_PATH = './log/'
const WRITE_DELAY = 200;

class Logger {
    constructor() {
        this.todayLog = new Date().toDateString();
        this.lastLogDay = '0';
        this.count = 0;
        this.logStack = [];
        this.timer = setInterval(() => {
            if (this.logStack.length) {
                fs.writeFile(`${LOG_PATH}${this.getTodayLogFilename()}.log`, this.logStack.join('\n'), {
                    flag: 'a+'
                }, err => {
                    this.logStack.length = 0;
                    err && console.error(err);
                });
            }
        }, 10*60*1000);
    }

    getTodayLogFilename() {
        const today = new Date();
        const todayTag = today.getMonth().toString() + today.getDate().toString();
        if (todayTag !== this.lastLogDay) {
            this.lastLogDay = todayTag;
            this.todayLog = new Date().toDateString();
            return this.todayLog;
        }
        return this.todayLog;
    }

    writeLog(type, ...message) {
        if (this.logStack.length < WRITE_DELAY) {
            this.logStack.push(`[${type}][${Date()}]: ` + message.join(' '));
        } else {
            fs.writeFile(`${LOG_PATH}${this.getTodayLogFilename()}.log`, this.logStack.join('\n'), {
                flag: 'a+'
            }, err => {
                this.logStack.length = 0;
                err && console.error(err);
            });
        }
    }

    info(...message) {
        this.writeLog('info', message);
    }

    error(...message) {
        this.writeLog('error', message);
    }
}

const logger = new Logger();

module.exports = {
    logger,
    Logger
}