var interval,
    onChangeHandler;

var streamingData = [ {
    "_type": "tweet",
    "_id": "3",
    "_source": {
    "user": "asdf",
    "message": "at the Zbottom"
    }
  },
  {
    "_type": "tweet",
  "_id": "1",
  "_source": {
    "user": "sid",
    "message": "at the top"
    }
  }
  ];


function getStreamingData(sdata) {

    // Get streaming data from a url continously !

  console.log(sdata);
  for(var each in sdata) {
    onChangeHandler(sdata[each]._type, "stock", sdata[each]);
  }

}

function start(onChange) {
    onChangeHandler = onChange;
    interval = setInterval(function() { getStreamingData(streamingData); }, 200);
}

function stop() {
    clearInterval(interval);
}

exports.start = start;
exports.stop = stop;