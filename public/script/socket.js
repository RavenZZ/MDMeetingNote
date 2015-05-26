var Socket = function () {
    var _this = this;
    var socket = io.connect(location.origin, {
        path: '/socket'
    });
    this.InitNote = function (calendarId, callback) {
        socket.emit('init note', {
            cid:calendarId
        }, function (isSuccess) {
            callback(isSuccess);
        });
    };

    socket.on('msg', function (data) {

    });
};
