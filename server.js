const Koa = require('koa'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    bodyparser = require('koa-bodyparser'),
    mcrouter = require('./router/minecraft').router,
    logger = require('./utils/log').logger,
    corsMgr = require('./utils/cors');

const config = require('./config');

const app = new Koa();

app.use(async (ctx, next) => {
    logger.info(`${ctx.ip} ${ctx.method} ${ctx.path}`);
    corsMgr.allowCors(ctx);
    await next();
})

// router ------------
app.use(bodyparser());
app.use(mcrouter.routes());
// router ------------


// server -------------
if (config.https) {
    var options = {
        key: fs.readFileSync(config.sslKeyPath),  //ssl文件路径
        cert: fs.readFileSync(config.sslCertPath)  //ssl文件路径
    };
    https.createServer(options, app.callback()).listen(config.httpsPort);
    console.log('https server is running on https://localhost:' + config.httpsPort);
}

http.createServer(app.callback()).listen(config.httpPort);
// server -------------

console.log('http server is running on http://localhost:' + config.httpPort);