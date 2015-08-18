// app and authentication configurations
const HOSTNAME = "scalr.api.appbase.io"
const APPNAME = "createnewtestapp01"
const USERNAME = "RIvfxo1u1"
const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

// elasticsearch client. we use it for indexing, mappings, search settings, etc.
var client = new elasticsearch.Client({
 host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
});

var sdata = [];
var headers = ["_type", "_id"];
var table = [];
var esTypes = [];
var streamMap = {};  // a dictionary to keep updates of streaming on types

var streamingClient = appbase.newClient({
    url: 'https://'+HOSTNAME,
    appname: APPNAME,
    username: USERNAME,
    password: PASSWORD
});

feed = (function () {

    function processStreams(response, callback) {
      if (response.hits) {
        console.log("multi responses.")
        for (var hit in response.hits.hits) {
          // console.log("r: ", response.hits.hits[hit]);
          callback(response.hits.hits[hit]);
        }
      } else {
        console.log("single response.")
        //console.log("r: ", response);
        callback(response);
      }
      console.log("---")
      return;
    }

    function applyStreamSearch(callback) {
      for (type in esTypes) {
        if (!streamMap[esTypes[type]] && esTypes[type][0] !== '.') {
          streamingClient.streamSearch({
            type: esTypes[type],
            body: {
              query: {
                match_all: {}
              }
            }
          }).on('data', function(res) {
              processStreams(res, callback);
          }).on('error', function(err) {
              console.log("caught a stream error", err);
          });
          streamMap[esTypes[type]] = true;
        }
      }
    }

    return {
        getData: function(callback) {
            applyStreamSearch(callback);
        },
        getTypes: function(callback){
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
