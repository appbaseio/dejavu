var appbase = require('appbase-js')
var elasticsearch = require('elasticsearch')
var esTypes = [];

// app and authentication configurations
const HOSTNAME = "scalr.api.appbase.io"
const APPNAME = "createnewtestapp01"
const USERNAME = "RIvfxo1u1"
const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

// elasticsearch client. we use it for indexing, mappings, search settings, etc.
var client = new elasticsearch.Client({
 host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
});


var streamingClient = appbase.newClient({
    url: 'https://'+HOSTNAME,
    appname: APPNAME,
    username: USERNAME,
    password: PASSWORD
});

streamingData = [];

function init(){
    var client = new elasticsearch.Client({
            host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
            apiVersion: '1.6'
        });
    client.index({
        index: APPNAME,
        type: "tweet",
        id: "1",
        body: {
            name: 'A green door',
            price: 12.50,
            tags: ['home', 'green'],
            stores: ['Walmart', 'Target']
        }
    }, function(err, res) {
        // if (!err)
        // console.log(res);
    });
}

function updateData(sdata) {
    var lucky = Math.round(Math.random());
    console.log(lucky);
    // sdata[lucky]._source.message = "dynamic message here";
    // sdata[lucky]._source.user = "dynamic user";
    if (lucky === 0) {
        sdata[0]._source.user = "sid";
        sdata[0]._source.message = "at the top";
    } else { 
        sdata[0]._source.user = "asdf";
        sdata[0]._source.message = "at the Zbottom";
    }
    return sdata;
}

function syncTypes() {
    function updateTypes(types) {
        esTypes = types.slice();
        // call the update type function here.
        // console.log(types);
        // this.setState({types: types});
    }
    // GET all the type names
    client.indices.getMapping({"index": APPNAME}).then(function(response) {
        for (var index in response) {
            if (response.hasOwnProperty(index)) {
                var mapping = response[index].mappings;
                var types = [];
                for (var type in mapping) {
                    if (mapping.hasOwnProperty(type)) {
                        types.push(type);
                    }
                }
                if (JSON.stringify(esTypes) !== JSON.stringify(types)){
                    updateTypes(types);
                }
             }
        }
    }, function(error) {
        console.log(error);
    });
};

function syncDocuments() {
    function updateDocuments(types) {
        esTypes = types.slice();
        // call the update type function here.
        // console.log(types);
    }

    // GET all the type names
    client.indices.getMapping({"index": APPNAME}).then(function(response) {
        for (var index in response) {
            if (response.hasOwnProperty(index)) {
                var mapping = response[index].mappings;
                var types = [];
                for (var type in mapping) {
                    if (mapping.hasOwnProperty(type)) {
                        types.push(type);
                    }
                }
                if (JSON.stringify(esTypes) !== JSON.stringify(types)){
                    updateTypes(types);
                }
             }
        }
    }, function(error) {
        console.log(error);
    });
};

/*
function streamUpdates() {
  
}
*/

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

function getStreamingData() {

}

function start(onChange) {
    onChangeHandler = onChange;
    setInterval(function() { getStreamingData(streamingData) }, 200);
    setInterval(syncTypes, 200);
}

exports.start = start;
exports.init = init;
exports.getStreamingData = getStreamingData;
