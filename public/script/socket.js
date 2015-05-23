
var Socket = function () {
    var socket = io.connect(location.origin,{
        path:'/socket'
    });
    socket.on('msg', function (data) {

    });
    return socket;
};
