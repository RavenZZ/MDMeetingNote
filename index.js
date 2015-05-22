
var config = require('./configuration');
var controller = require('./controller');
var express = require('express');
var RedisStore = require('connect-redis')(express);
var redis = require('redis');
var redisConfig = config.redis;
var redisClient = redis.createClient(redisConfig.port,redisConfig.host);

var app = express();

app.configure(function () {
    app.use( express.cookieParser() );
    app.set("port", config.server.port);
    app.use(express.session({
        secret: "ravenHaha",
        store: new RedisStore({
            host: redisConfig.host,
            port: redisConfig.port,
            client: redisClient,
            prefix: 'ravenHeHe',
            maxAge: 14400000
        })
    }));
});




app.get('/', controller.CheckAuth, function (req, res, next) {
    res.send(200, 'index');
});
app.get('/login', controller.Login);
app.get('/authorize_callback', controller.AuthCallback);





















app.listen(app.get('port'));
console.log('server is running at port '+app.get('port'));











