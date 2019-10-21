const db = require('../database/db');

async function getUserInfo(sessionId) {
    const user = await db.query({ sessionId: sessionId });
    return user;
}

module.exports = {
    getUserInfo
}
