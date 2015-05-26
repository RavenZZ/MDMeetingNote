var colors = require('colors');
var mongo = require('./mongo');

var connection = function (io) {
    var _this = this;

    this.OnConnection = function (socket) {
        console.log(('connected socket.id ' + socket.id).green);

        socket.on('init note', function (data,callback) {
            console.log('init not : ',JSON.stringify(data).red);
            callback(true);
        });
    };

};


module.exports = connection;