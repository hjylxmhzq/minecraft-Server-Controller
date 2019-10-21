const router = require('koa-router')();
const crypto = require('../../utils/crypto');
const db = require('../../database/db');

function formatCheck(dataBody) {
    if ('userName' in dataBody && 'password' in dataBody) {
        return true;
    }
    return false;
}

function setCookie(ctx) {
    const sessionId = Math.random().toString().substr(2);
    ctx.cookies.set(
        'cid', sessionId, {
        // domain:'tony-space.top', // 写cookie所在的域名
        // path:'/',       // 写cookie所在的路径
        maxAge: 2 * 60 * 60 * 1000,   // cookie有效时长
        expires: new Date('2021-01-01'), // cookie失效时间
        // secure: false,
        // httpOnly:false,  // 是否只用于http请求中获取
        // overwrite:false  // 是否允许重写
    }
    );
    return sessionId;
}

router.post('/api/auth-regist', async (ctx, next) => {
    const body = ctx.request.body;
    if (formatCheck(body)) {
        const user = await db.query({ userName: body.userName });
        if (user.length) {
            const resBody = {
                message: 'user exists',
                status: -1,
                sessionId: ''
            }
            ctx.body = JSON.stringify(resBody);
        } else {
            const sessionId = setCookie(ctx);
            const userInfo = {
                "uid": Math.random().toString().substr(2),
                "nickName": body.nickName || '',
                "userName": body.userName,
                "password": crypto.sha256Hash(body.password),
                "lastLogin": -1,
                "registTimeStamp": +new Date(),
                "email": body.email || '',
                "userInfo": '',
                "sessionId": sessionId
            }
            await db.insert(userInfo);
            // setCookie(ctx, body.userName);
            const resBody = {
                message: 'cookie is set',
                status: 0,
                sessionId
            }
            ctx.body = JSON.stringify(resBody);
        }
    } else {
        const resBody = {
            message: 'regist info error',
            status: -1,
            sessionId: ''
        }
        ctx.body = JSON.stringify(resBody);
    }
    next();
});

router.post('/api/auth-login', async (ctx, next) => {
    const loginData = ctx.request.body;
    if (formatCheck(loginData)) {
        const user = await db.query({userName: loginData.userName});
        if (user.length && user[0].password === crypto.sha256Hash(loginData.password)) {
            const sessionId = setCookie(ctx);
            await db.update({ userName: loginData.userName }, { $set: { sessionId: sessionId }});
            await db.update({ userName: loginData.userName }, { $set: { lastLogin: +new Date() }});
            const resBody = {
                message: 'cookie is set',
                status: 0,
                sessionId
            }
            ctx.body = JSON.stringify(resBody);
        } else {
            const resBody = {
                message: 'unexist user or uncorrect password',
                status: -1,
                sessionId: ''
            }
            ctx.body = JSON.stringify(resBody);
        }
    } else {
        const resBody = {
            message: 'error login form format',
            status: -1,
            sessionId: ''
        };
        ctx.body = JSON.stringify(resBody);
    }
    next();
})

module.exports = { router };