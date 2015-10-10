
// This file contains all the logic for your app
// authentication and streaming data from your
// endpoint.


// **Configs:** Appname and Credentials
const HOSTNAME = config["HOSTNAME"]
const APPNAME = config["APPNAME"]
const USERNAME = config["USERNAME"]
const PASSWORD = config["PASSWORD"]

// Instantiating elasticsearch client
var client = new elasticsearch.Client({
 host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
});

// vars for tracking current data and types
var sdata = {};         // data to be displayed in table
var headers = ["_type", "_id"];
var esTypes = [];       // all the types in current 'app'
var subsetESTypes = []; // currently 'selected' types

// Instantiating appbase client with the global configs defined above.
var streamingClient = new Appbase({
    url: 'https://'+HOSTNAME,
    appname: APPNAME,
    username: USERNAME,
    password: PASSWORD
});

feed = (function () {

    // processStreams() takes the continuous responses
    // and passes it to it's caller -> UI view.
    function processStreams(response, callback) {
      if (response.hits) {
        for (var hit in response.hits.hits) {
          callback(response.hits.hits[hit]);
        }
      } else {
        callback(response);
      }
      return;
    }

    // applies a streamSearch() query on a particular ``type``
    // to establish a continuous query connection.
    function applyStreamSearch(typeName, callback) {
      if (typeName !== null) {
        console.log("type to be streamed: ", typeName);
        streamingClient.streamSearch({
          stream: true,
          type: typeName,
          body: {
            from: 0,  // start from zero: no pagination
            size: 20, // show up to 20 results initally
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
        // exposes ``applyStreamSearch()`` as ``getData()``
        getData: function(typeName, callback) {
            applyStreamSearch(typeName, callback);
        },
        // ``deleteData()`` deletes the data records when
        // a type is unchecked by the user.
        deleteData: function(typeName, callback) {
            localSdata = [];
            for (data in sdata) {
                if (sdata[data]._type !== typeName)
                    localSdata.push(sdata[data]);
            }
            sdata = localSdata.slice();
            callback(sdata);
        },
        // gets all the types of the current app;
        // this involves a surprisingly non-trivial parsing -
        // wish ES had a direct endpoint to show types in an app.
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
