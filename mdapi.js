var colors = require('colors');
var request = require('request');
var querystring = require('querystring');
var https = require('https');
var config = require('./configuration');
var util = require('util');
var callbackUrl = util.format('http://%s:%s/authorize_callback', config.server.host, config.server.port);
var apiLoginUrl = util.format('%sauth2/authorize?app_key=%s&redirect_uri=%s', config.app.apiUrl, config.app.appKey, callbackUrl);

var URLs = {
    accessToken: config.app.apiUrl + 'oauth2/access_token',
    userDetail: config.app.apiUrl + 'passport/detail',
    joinedTasks: config.app.apiUrl + 'task/my_joined',
    joinedCalendar: config.app.apiUrl + 'calendar/day'
};

function GetToken(code, callback) {
    var params = {
        app_Key: config.app.appKey,
        app_secret: config.app.appSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: callbackUrl,
        format: 'json'
    };

    console.time('get token time'.blue);
    request.post({url: URLs.accessToken, form: params}, function (error, response, body) {
        console.timeEnd('get token time'.blue);
        if (!error && response.statusCode == 200) {
            var result = null;
            try {
                result = JSON.parse(body);
                callback(null, result);
            } catch (e) {
                callback(new Error('Get token Parse Error'), body);
            }
        } else {
            callback(new Error('Get token Error'), body);
        }
    });

}

function GetCurrentUserInfo(token, callback) {
    var params = {
        access_token: token,
        format: 'json'
    };
    console.time('get user info'.blue);
    request.post({url: URLs.userDetail, form: params}, function (error, response, body) {
        console.timeEnd('get user info'.blue);
        if (!error && response.statusCode == 200) {
            var result = null;
            try {
                result = JSON.parse(body);
                callback(null, result.user);
            } catch (e) {
                callback(new Error('Get Current User Info Parse Error'), body);
            }
        } else {
            callback(new Error('Get token Parse Error'), body);
        }
    });
}

/*
 * filterType 1 未完成, 0 所有
 * */
function GetJoinedTasks(token, filterType, keywords, callback) {
    var params = {
        access_token: token,
        f_type: filterType,
        keywords: keywords,
        format: 'json'
    };
    console.time('get joined tasks'.blue);
    request.post({url: URLs.joinedTasks, form: params}, function (error, response, body) {
        console.timeEnd('get joined tasks'.blue);
        if (!error && response.statusCode == 200) {
            var result = null;
            try {
                result = JSON.parse(body);
                var tasks = result.tasks.map(function (obj) {
                    var chargeUser = {
                        id: obj.user.id,
                        name: obj.user.id,
                        avatar: obj.user.avatar
                    };
                    return {
                        id: obj.guid,
                        name: obj.title,
                        user: chargeUser
                    }
                });
                callback(null, tasks);
            } catch (e) {
                console.log(e.message)
                callback(new Error('Get joined tasks Error'), body);
            }

        } else {
            callback(new Error('Get joined tasks Error'), body);
        }
    });
}

function GetJoinedCalendar(token, date, callback) {
    var params = {
        access_token: token,
        date: date,
        format: 'json'
    };
    console.time('get joined calendar'.blue);
    request.post({url: URLs.joinedCalendar, form: params}, function (error, response, body) {
        console.timeEnd('get joined calendar'.blue);
        if (!error && response.statusCode == 200) {
            var result = null;
            try {
                result = JSON.parse(body);
                var cals = [];
                result.calendars.forEach(function (obj) {
                    if(!obj.isTask){
                        cals.push({
                            id:obj.id,
                            title:obj.title
                        });
                    }
                });
                callback(null, cals);
            } catch (e) {
                callback(new Error('Get joined calendars parse Error'), body);
            }
        } else {
            callback(new Error('Get joined calendars Error'), body);
        }
    });
}

exports.GetJoinedCalendar = GetJoinedCalendar;
exports.GetJoinedTasks = GetJoinedTasks;
exports.GetCurrentUserInfo = GetCurrentUserInfo;
exports.ApiLoginUrl = apiLoginUrl;
exports.GetToken = GetToken;