var colors = require('colors');
var request = require('request');
var querystring = require('querystring');
var https = require('https');
var config = require('./configuration');
var util = require('util');
var callbackUrl = util.format('http://%s:%s/authorize_callback',config.server.host,config.server.port);
var apiLoginUrl = util.format('%sauth2/authorize?app_key=%s&redirect_uri=%s',config.app.apiUrl,config.app.appKey,callbackUrl);

var URLs ={
    accessToken: config.app.apiUrl+'oauth2/access_token',
    userDetail: config.app.apiUrl+'passport/detail'
};

function GetToken(code, callback) {
    var params = {
        app_Key: config.app.appKey,
        app_secret: config.app.appSecret,
        grant_type: 'authorization_code',
        code : code,
        redirect_uri: callbackUrl,
        format: 'json'
    };

    console.time('get token time'.blue);
    request.post({url:URLs.accessToken,form:params}, function (error, response, body) {
        console.timeEnd('get token time'.blue);
        if(!error && response.statusCode == 200){
            var result=null;
            try{
                result = JSON.parse(body);
                callback(null,result);
            }catch (e){
                callback(new Error('Get token Parse Error'),body);
            }
        }else{
            callback(new Error('Get token Error'),body);
        }
    });

}

function GetCurrentUserInfo (token, callback){
    var params={
        access_token: token,
        format:'json'
    };
    console.time('get user info'.blue);
    request.post({url:URLs.userDetail,form:params}, function (error, response, body) {
        console.timeEnd('get user info'.blue);
        if(!error && response.statusCode == 200){
            var result=null;
            try{
                result = JSON.parse(body);
                callback(null, result.user);
            }catch (e){
                callback(new Error('Get Current User Info Parse Error'),body);
            }
        }else{
            callback(new Error('Get token Parse Error'),body);
        }
    });
}

function GetJoinedTasks(toekn, callback) {

}




exports.GetCurrentUserInfo = GetCurrentUserInfo;
exports.ApiLoginUrl = apiLoginUrl;
exports.GetToken = GetToken;