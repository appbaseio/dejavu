// var appbase = require('appbase-js')
//    elasticsearch = require('elasticsearch')
//    esTypes = [];

// app and authentication configurations
const HOSTNAME = "scalr.api.appbase.io"
const APPNAME = "createnewtestapp01"
const USERNAME = "RIvfxo1u1"
const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

// elasticsearch client. we use it for indexing, mappings, search settings, etc.
/*
var client = new elasticsearch.Client({
 host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
});
*/

var streamingClient = appbase.newClient({
    url: 'https://'+HOSTNAME,
    appname: APPNAME,
    username: USERNAME,
    password: PASSWORD
});

feed = (function () {

    var socket = io();

    return {
        onChange: function(callback) {
            socket.on('data', callback);
        },
        watch: function(symbols) {
            socket.emit('join', symbols);
        },
        unwatch: function(symbol) {
            socket.emit('leave', symbol);
        },
        getData: function(callback){
            // Get streaming data from a url continously !
            streamingClient.streamSearch({
                type: 'tweet',
                body: {
                query: {
                    match_all: {}
                    }
                }
            }).on('data', function(res) {
              // client would emit "data" event every time there is a document update.
              callback(res);
            }).on('error', function(err) {
              console.log(err)
              return
            })
        },
        getTypes: function(callback){

        }
    };

}());