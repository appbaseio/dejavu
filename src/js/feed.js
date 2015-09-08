/*
    This file contains all the logic for your app
    authentication and streaming data from your
    endpoint.

*/

// app and authentication configurations
const HOSTNAME = "scalr.api.appbase.io"
const APPNAME = "createnewtestapp01"
const USERNAME = "RIvfxo1u1"
const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

// elasticsearch client. we use it for indexing, mappings, search settings, etc.
var client = new elasticsearch.Client({
 host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
});

var sdata = {};
var headers = ["_type", "_id"];
var table = [];
var columns = [];
var esTypes = [];
var subsetESTypes = [];

var streamingClient = new appbase({
    url: 'https://'+HOSTNAME,
    appname: APPNAME,
    username: USERNAME,
    password: PASSWORD
});

feed = (function () {

    function processStreams(response, callback) {
      if (response.hits) {
        for (var hit in response.hits.hits) {
          // console.log(response.hits.hits[hit]);
          callback(response.hits.hits[hit]);
        }
      } else {
        callback(response);
      }
      return;
    }

    function applyStreamSearch(typeName, callback) {
      if (typeName !== null) {
        streamingClient.streamSearch({
          stream: true,
          type: typeName,
          body: {
            from: 0,
            size: 20, // show max 20 objects initally
            query: {
              match_all: {}
            }
          }
        }).on('data', function(res) {
            processStreams(res, callback);
        }).on('error', function(err) {
            console.log("caught a stream error", err);
        });
      }
    }

    return {
        getData: function(typeName, callback) {
            applyStreamSearch(typeName, callback);
        },
        deleteData: function(typeName, callback) {
            localSdata = [];
            for (data in sdata) {
                if (sdata[data]._type !== typeName)
                    localSdata.push(sdata[data]);
            }
            sdata = localSdata.slice();
            callback(sdata);
        },
        getTypes: function(callback){
            client.indices.getMapping({"index": APPNAME}).then(function(response) {
                for (var index in response) {
                    if (response.hasOwnProperty(index)) {
                        var mapping = response[index].mappings;
                        var types = [];
                        for (var type in mapping) {
                            if (mapping.hasOwnProperty(type) && type[0] !== "_" && type !== ".percolator") {
                                types.push(type);
                            }
                        }
                        if (JSON.stringify(esTypes) !== JSON.stringify(types)){
                            esTypes = types.slice();
                            callback(types);
                        }
                     }
                }
            }, function(error) {
                console.log(error);
            })
        }
    };

}());
