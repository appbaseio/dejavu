var interval,
    onChangeHandler;

var stocks = [
            {
            _type: "tweet",
            _id: "3",
            _source: {
              user: "asdf",
              message: "at the Zbottom"
                }
            },
            {
            _type: "tweet",
            _id: "1",
            _source: {
              user: "sid",
              message: "at the top",
              some_other_field: "something_else"
                }
            }
];

function simulateChange() {

    onChangeHandler("tweet", 'stock', {
            _type: "tweet",
            _id: "1",
            _source: {
              user: "sid",
              message: "at the top",
              some_other_field: "something_else"
                }
            });
    
    onChangeHandler("tweet", 'stock', {
            _type: "tweet",
            _id: "2",
            _source: {
              user: "sid",
              message: "at the top",
              some_other_field: "something_else"
                }
            });
    onChangeHandler("tweet", 'stock', {
            _type: "tweet",
            _id: "2",
            _source: {
              user: "siddi",
              message: "at the top",
              some_other_field: "something_else"
                }
            });
}

function start(onChange) {
    onChangeHandler = onChange;
    interval = setInterval(simulateChange, 200);
}

function stop() {
    clearInterval(interval);
}

exports.start = start;
exports.stop = stop;