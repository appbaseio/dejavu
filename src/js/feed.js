
// This file contains all the logic for your app
// authentication and streaming data from your
// endpoint.


// **Configs:** Appname and Credentials
const HOSTNAME = "scalr.api.appbase.io"
var APPNAME, USERNAME, PASSWORD;
var appbaseRef;
var getMapFlag = false;

parent.globalAppData(function(res) {
  APPNAME = res.appname;
  USERNAME = res.username;
  PASSWORD = res.password;
  EMAIL = res.email
  init();
  APPURL = 'https://'+USERNAME+':'+PASSWORD+'@scalr.api.appbase.io/'+APPNAME;         
});

function init() {
  // Instantiating appbase ref with the global configs defined above.
  appbaseRef = new Appbase({
      url: 'https://'+HOSTNAME,
      appname: APPNAME,
      username: USERNAME,
      password: PASSWORD
  });
}

// vars for tracking current data and types
var sdata = {};         // data to be displayed in table
var headers = ["_type", "_id"];
var esTypes = [];       // all the types in current 'app'
var subsetESTypes = []; // currently 'selected' types
var offsets = {}; // helps us for pagination

var feed = (function () {

    // applies a searchStream() query on a particular ``type``
    // to establish a continuous query connection.
    function applyStreamSearch(typeName, callback, queryBody) {
      if (typeName !== null) {
        var defaultQueryBody = {
          query: {
            match_all: {}
          }
        }

        var queryBody = queryBody ? queryBody : defaultQueryBody;
        // get historical data
        appbaseRef.search({
          type: typeName,
          from: 0,
          size: 20,
          body: queryBody
        }).on('data', function(res) {
            for (var hit in res.hits.hits) {
              callback(res.hits.hits[hit]);
            }
            if(res.hits.hits.length == 0){
              callback(null);
            }
        }).on('error', function(err) {
            console.log("caught a retrieval error", err);
        })
        // get new data updates
        appbaseRef.searchStream({
          type: typeName,
          body: queryBody,
        }).on('data', function(res) {
            callback(res, true);
        }).on('error', function(err) {
            console.log("caught a stream error", err);
        });
      }
    }

    // paginate and show new results when user scrolls
    // to the bottom of the existing results.
    function paginationSearch(typeName, from, callback, queryBody) {
      if (typeName !== null)
        
        var defaultQueryBody = {
          query: {
            match_all: {}
          }
        }
        var queryBody = queryBody ? queryBody : defaultQueryBody;

        appbaseRef.search({
          type: typeName,
          from: from,
          size: 20,
          body:queryBody
        }).on('data', function(res) {
            for (var hit in res.hits.hits) {
              callback(res.hits.hits[hit]);
            }
        })
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
        // ``paginateData()`` finds the type offsets in
        // multiples of 20 and finds new results using the offset.
        paginateData: function(offsets, callback, queryBody) {
            for (type in offsets) {
                if (offsets[type] >= 20 && offsets[type] % 20 === 0){
                    if(queryBody != null)
                      paginationSearch(type, offsets[type], callback, queryBody)
                    else
                      paginationSearch(type, offsets[type], callback)
                }
            }
        },
        // gets all the types of the current app;
        getTypes: function(callback){
            if(typeof APPNAME != 'undefined'){
              appbaseRef.getTypes().on('data', function(res) {
                  var types = res.filter(function(val){return val[0]!=='.'});
                  if (JSON.stringify(esTypes) !== JSON.stringify(types)) {
                    esTypes = types.slice();
                    callback(types);
                  }
              }).on('error', function(err) {
                  console.log('error in retrieving types: ', err)
              })
            }
            else{
              var $this = this;
              setTimeout(function(){
                  $this.getTypes(callback);
              },1000);
            }
        },        
        indexData: function(recordObject, callback) {
          console.log(recordObject);
          appbaseRef.index(recordObject).on('data', function(res) {
            if(callback)
              callback();
          });
        },
        getSingleDoc:function(type, callback){
          appbaseRef.search({
            type:type,
            from:0,
            size:1,
            body:{query:{match_all:{}}}
          }).on('data',function(data){
            callback(data);
          });
        },
        getMapping:function(){
          var APPURL = 'https://'+USERNAME+':'+PASSWORD+'@scalr.api.appbase.io/'+APPNAME;
          var createUrl = APPURL+'/_mapping';
          return $.ajax({
            type:'GET',
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", "Basic " + btoa(USERNAME+':'+PASSWORD));
            },
            url:createUrl,
            xhrFields: {
               withCredentials: true
            }
          });
        },
        filterQuery:function(method, columnName, value, typeName, callback){
          var queryBody = this.createFilterQuery(method, columnName, value, typeName);
          applyStreamSearch(typeName, callback, queryBody);
        },
        //Create Filter Query by passing attributes
        createFilterQuery:function(method, columnName, value, typeName){
          var queryBody = {};
          switch(method){
            case 'has':              
              var queryMaker = [];
              value.forEach(function(val){
                var termObj = {};
                termObj[columnName] = val.trim();
                var obj = {
                  'term':termObj
                };
                queryMaker.push(obj);
              });
              queryBody = {
                "query":{
                  "bool":{
                    "should":queryMaker,
                    "minimum_should_match":1
                  }
                }
              }
            break;

            case 'has not':              
              var queryMaker = [];
              value.forEach(function(val){
                var termObj = {};
                termObj[columnName] = val.trim();
                var obj = {
                  'term':termObj
                };
                queryMaker.push(obj);
              });
              queryBody = {
                "query":{
                  "bool":{
                    "must_not":queryMaker,
                    "minimum_should_match":1
                  }
                }
              }
            break;

            case 'search':              
              var queryMaker = [];
              var termObj = {};
              termObj[columnName] = value[0].trim();
              queryBody = {"query":{"match":termObj}};
            break;

             case 'greater than':              
              termObj = {};
              termObj[columnName] = {};
              termObj[columnName] = {"gte":value[0]};
              queryBody = {
                "query":{
                  "range":termObj
                }
              };
            break;

            case 'less than':              
              termObj = {};
              termObj[columnName] = {};
              termObj[columnName] = {"lte":value[0]};
              queryBody = {
                "query":{
                  "range":termObj
                }
              };
            break;
          }
          return queryBody;
        }
    };


  

}());
