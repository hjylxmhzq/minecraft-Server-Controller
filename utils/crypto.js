const crypto = require('crypto');

function sha256Hash(str) {
    return crypto.createHash('SHA256').update(str).digest('hex');
}

module.exports = {
    sha256Hash,
}