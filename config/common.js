module.exports = {
    mode: process.env.NODE_ENV, // use this config to change mode;
    sslKeyPath: '../ssl/tony-space.top.key',  //ssl文件路径
    sslCertPath: '../ssl/tony-space.top.pem',  //ssl文件路径
    httpsPort: 8010,
    httpPort: 8011,
    javaParams: {
        xms: '64m',
        xmx: '512m'
    }
};