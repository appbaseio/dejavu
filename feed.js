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

function updateData(sdata) {
    var lucky = Math.round(Math.random());
    console.log(lucky);
    sdata[lucky]._source.message = "dynamic message here";
    sdata[lucky]._source.user = "dynamic user";
    if (lucky === 0) {
        sdata[1]._source.user = "sid";
        sdata[1]._source.message = "at the top";
    } else { 
        sdata[0]._source.user = "asdf";
        sdata[0]._source.message = "at the Zbottom";
    }
    return sdata;
}

function getStreamingData(sdata) {

    // Get streaming data from a url continously !

  console.log(sdata);
  for(var each in sdata) {
    onChangeHandler(sdata[each]._type, "stock", sdata[each]);
  }

}

function start(onChange) {
    onChangeHandler = onChange;
    interval = setInterval(function() { getStreamingData(streamingData); updateData(streamingData)}, 200);
}

function stop() {
    clearInterval(interval);
}

exports.start = start;
exports.stop = stop;