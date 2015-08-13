var interval,
    onChangeHandler;

var stocks = [];


function getStreamingData() {

    // Get streaming data from a url continously !
}

function start(onChange) {
    onChangeHandler = onChange;
    interval = setInterval(getStreamingData, 200);
}

function stop() {
    clearInterval(interval);
}

exports.start = start;
exports.stop = stop;