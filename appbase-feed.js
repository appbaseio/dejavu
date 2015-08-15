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


function syncTypes() {

    function updateTypes(types) {
        esTypes = types.slice();
        // call the update type function here.
        console.log(types);
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
                if (JSON.stringify(esTypes) !== JSON.stringify(types)) updateTypes(types);
             }
        }
    }, function(error) {
        console.log(error);
    });
};

function streamUpdates() {
  
}

syncTypes();
setInterval(syncTypes, 60*1000); // every 1 minute
