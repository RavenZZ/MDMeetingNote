var config = {
    server: {
        host: 'localhost',
        port: 8888
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    mongodb: {
        host: '127.0.0.1',
        port: 27017,
        database: 'notes'
    },
    app: {
        appKey: 'CD1ACC391E4D',
        appSecret: 'AB94FA4498F289A789C39136E1819DF',
        apiUrl: 'https://api2.mingdao.com/',
        callbackUrl: 'authorize_callback'
    }
};


module.exports = config;