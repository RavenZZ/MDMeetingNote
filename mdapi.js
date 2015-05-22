var request = require('request');
var querystring = require('querystring');
var https = require('https');
var config = require('./configuration');
var util = require('util');
var callbackUrl = util.format('http://%s:%s/authorize_callback',config.server.host,config.server.port);
var apiLoginUrl = util.format('%sauth2/authorize?app_key=%s&redirect_uri=%s',config.app.apiUrl,config.app.appKey,callbackUrl);

var URLs ={
    accessToken:config.app.apiUrl+'oauth2/access_token'

};

function GetToken(code, callback) {
    var query = {
        app_Key: config.app.appKey,
        app_secret: config.app.appSecret,
        grant_type: 'authorization_code',
        code : code,
        redirect_uri: callbackUrl,
        format: 'json'
    };
    var queryString = querystring.stringify(query);
    var url = URLs.accessToken+'?'+queryString;
    console.time('get token time');
    console.log(url);
    request(url, function (error, response, body) {
        console.timeEnd('get token time');
        console.log(body);
        if(!error && response.statusCode == 200){
            try{
                var result = JSON.parse(body);
                console.log('the token is ',result);
                callback(null,result);
            }catch (e){
                callback(new Error('Get token Parse Error'),'Get token Parse Error');
            }
        }else{
            callback(new Error(error),body);
        }
    });

}




exports.ApiLoginUrl = apiLoginUrl;
exports.GetToken = GetToken;