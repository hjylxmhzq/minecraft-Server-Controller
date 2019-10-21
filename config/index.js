const devConfig = require('./development');
const prdConfig = require('./production');
const commonConfig = require('./common');

if (process.env.NODE_ENV.includes('dev')) {
    module.exports = {
        ...commonConfig,
        ...devConfig,
    }
} else {
    module.exports = {
        ...commonConfig,
        ...prdConfig,
    }
}