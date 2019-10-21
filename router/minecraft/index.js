const router = require('koa-router')();
const crypto = require('../../utils/crypto');
const { exec, execSync } = require('child_process');
const path = require('path');
const config = require('../../config');
const fs = require('fs');

function getCurrentProcess() {
    const output = execSync('ps -ax | grep server.jar', { cwd: path.resolve('.') });
    const processList = output.toString().split('\n');
    const processInfo = processList.find(item => {
        return item.includes('java');
    });
    if (processInfo) {
        const outputObj = {
            pid: processInfo.split(' ')[0]
        }
        return JSON.stringify(outputObj);
    } else {
        return '{}';
    }
}

function startServer() {
    if (JSON.parse(getCurrentProcess()).pid) {
        return JSON.stringify({pid: -1, message: 'server is already running'});
    }
    const output = exec(`java -Xms${config.javaParams.xms} -Xmx${config.javaParams.xmx} -jar ${path.resolve(__dirname, '../../private/mcserver/server.jar')} nogui`,
    { cwd: path.resolve(__dirname, '../../private/mcserver/') },
    (err, stdout, stderr) => {
        console.log(err, stdout, stderr);
    });
    return JSON.stringify({pid: output.pid, message: 'server started'});
}

function stopServer() {
    const pid = JSON.parse(getCurrentProcess()).pid;
    if (pid) {
        const output = execSync(`kill ${pid}`);
        return JSON.stringify({message: 'server is stopped'});
    } else {
        return JSON.stringify({message: 'no server is running'});
    }
}

function getLog() {
    const logFilePath = path.resolve(__dirname, '../../private/mcserver/logs/latest.log');
    const isConfigExist = fs.existsSync(logFilePath);
    if (isConfigExist) {
        return fs.readFileSync(logFilePath, {encoding: 'utf8'});
    } else {
        return 'no config file found, please you have start server at least once.'
    }
}

router.get('/api/mc-getstatus', async (ctx, next) => {
    ctx.body = getCurrentProcess();
    await next();
});

router.get('/api/mc-getlog', async (ctx, next) => {
    ctx.body = getLog();
    await next();
});

router.get('/api/mc-startserver', async (ctx, next) => {
    const output = startServer();
    ctx.body = output;
    await next();
});

router.get('/api/mc-stopserver', async (ctx, next) => {
    ctx.body = stopServer();
    await next();
});

router.get('/api/mc-restartserver', async (ctx, next) => {
    stopServer();
    ctx.body = startServer();
    await next();
});

router.get('/api/mc-getconfig', async (ctx, next) => {
    const configFilePath = path.resolve(__dirname, '../../private/mcserver/server.properties');
    const isConfigExist = fs.existsSync(configFilePath);
    if (isConfigExist) {
        ctx.body = fs.readFileSync(configFilePath, {encoding: 'utf8'});
    } else {
        ctx.body = 'no config file found, please you have start server at least once.'
    }
    await next();
});

router.get('/api/mc-updateconfig', async (ctx, next) => {
    const configFilePath = path.resolve(__dirname, '../../private/mcserver/server.properties');
    const isConfigExist = fs.existsSync(configFilePath);
    if (isConfigExist) {
        const fileContent = fs.readFileSync(configFilePath, {encoding: 'utf8'});
        let configList = fileContent.split('\n');
        for (let i in ctx.query) {
            const index = configList.findIndex(item => {
                return i === item.split('=')[0];
            })
            if (index !== -1) {
                const _n = configList[index].split('=');
                _n.splice(1, 1, ctx.query[i]);
                configList[index] = _n.join('=');
            }
        };
        const newFile = configList.join('\n');
        fs.writeFileSync(configFilePath, newFile, {encoding: 'utf8'});
        ctx.body = newFile;
    } else {
        ctx.body = 'no config file found, please you have start server at least once.'
    }
    await next();
});

router.get('/api/mc-resetconfig', async (ctx, next) => {
    const configBackupFilePath = path.resolve(__dirname, '../../private/mcserver/server.bak.properties');
    const configFilePath = path.resolve(__dirname, '../../private/mcserver/server.properties');
    const _content = fs.readFileSync(configBackupFilePath, {encoding: 'utf8'});
    fs.writeFileSync(configFilePath, _content, {encoding: 'utf8'});
    ctx.body = _content;
    await next();
});

router.get('/', (ctx, next) => {
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../../templates/index.html'), {encoding: 'utf8'});
    next();
})

module.exports = { router };