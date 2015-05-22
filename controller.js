var config = require('./configuration');
var mdapi = require('./mdapi');
var ApiLoginUrl = mdapi.ApiLoginUrl;
var async = require('async');

function CheckAuth(req,res,next) {
    if(!req.session || !req.session.user || !req.session.token){
        console.warn('There is No Session');
        res.writeHead(302,{
           'Location':'login',
            'content-type':'text/html'
        });
        res.end();
    }else{
        console.log('The token is ',req.session.token);
        next();
    }
}


function Login(req,res,next){
    if (!req.session || !req.session.token) {
        console.warn('Login: no session');
        res.writeHead(302, {
            'Location': ApiLoginUrl,
            'content-type': 'text/html'
        });
        res.end();
    }else{
        console.log('There is session');
        res.redirect('index');
        res.end();
    }
}

function AuthCallback(req,res,next){
    console.log('authorize_callback  ', JSON.stringify(req.query));
    var code = req.query.code;
    var state = req.query.stale;
    var token = null;
    async.series([
        function (ok) {
            mdapi.GetToken(code, function (getTokenError, tokenObj) {
                if(getTokenError){
                    ok(getTokenError);
                }else{
                    console.log('token string',tokenObj.access_token);
                    token = tokenObj.access_token;
                }
                ok();
            });
        }, function (ok) {
            console.log(token)
            res.send(token);
        }

    ], function (err) {
        res.json({err:err});
    });



}


exports.CheckAuth = CheckAuth;
exports.Login = Login;
exports.AuthCallback = AuthCallback;


