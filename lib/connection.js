var colors = require('colors');

var connection = function (io) {
    var _this = this;

    this.OnConnection = function (socket) {
        console.log(('connected socket.id '+socket.id).green);

    };

};














module.exports = connection;