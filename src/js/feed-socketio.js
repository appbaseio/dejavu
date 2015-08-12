feed = (function () {

    var socket = io();

    return {
        onChange: function(callback) {
            socket.on('stock', callback);
        },
        watch: function(symbols) {
            socket.emit('join', symbols);
        },
        unwatch: function(symbol) {
            socket.emit('leave', symbol);
        }
    };

}());