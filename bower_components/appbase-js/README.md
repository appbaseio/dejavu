# appbase-js

Appbase.io streaming client lib for Node.JS and Javascript (browser builds in [/browser/](https://github.com/appbaseio/appbase-js/tree/master/browser)), can be used with [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html).

## Quick Example

Working code snippets where each step builds on the previous ones.

#### Step 1: Add some data into the app (uses elasticsearch.js)
```js
// app and authentication configurations 
const HOSTNAME = "scalr.api.appbase.io"
const APPNAME = "createnewtestapp01"
const USERNAME = "RIvfxo1u1"
const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

// Add data into our ES "app index"
var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
			host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
			apiVersion: '1.6'
		});
client.index({
    index: APPNAME,
    type: "product",
    id: "1",
    body: {
        name: 'A green door',
        price: 12.50,
        tags: ['home', 'green'],
        stores: ['Walmart', 'Target']
    }
}, function(err, res) {
    if (!err)
      console.log(res);
});
```

#### Step 2: Stream the Document Updates

```js
var appbase = require('appbase-js')
var streamingClient = appbase.newClient({
      url: 'https://'+HOSTNAME,
      appname: APPNAME,
      username: USERNAME,
      password: PASSWORD
});
streamingClient.streamDocument({
      type: 'product',
      id: '1'
}).on('data', function(res) {
      // client would emit "data" event every time there is a document update.
      console.log(res)
}).on('error', function(err) {
      console.log(err)
      return
})
```

##### Console Output

```js
{ _index: 'app`248',
  _type: 'product',
  _id: '1',
  _version: 4,
  found: true,
  _source: 
   { name: 'A green door',
     price: 12.5,
     tags: [ 'home', 'green' ],
     stores: [ 'Walmart', 'Target' ] } }
```

streamDocument() returns a ``stream.Readable`` object, which can be conveniently listened via the 'on("data")' event listener. Check out the [get_test.js](https://github.com/appbaseio/appbase-js/blob/master/test/get_test.js) where we make an update to the document and see it stream. 

#### Step 3: Streaming Queries

While streaming documents is straightforward, streaming queries touch the entire breadth of [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) - boolean, regex, geo, fuzzy to name a few. We will stream the results of a simple **``match_all``** query on the ``product`` type:

```js
streamingClient.streamSearch({
	type: 'product',
	body: {
		query: {
			match_all: {}
		}
	}
}).on('data', function(res, err) {
	console.log(res);
}).on('error', function(err) {
	console.log("caught a stream error", err)
	return
})
```

##### Console Output

```js
{ took: 1,
  timed_out: false,
  _shards: { total: 1, successful: 1, failed: 0 },
  hits: 
   { total: 4,
     max_score: 1,
     hits: [ [Object], [Object], [Object], [Object] ] } }
```

streamSearch() also returns a ``stream.Readable`` object, which can be conveniently listened via the 'on("data")' event listener. Check out the [search_test.js](https://github.com/appbaseio/appbase-js/blob/master/test/search_test.js) where we make an update that matches the query and see it stream. 


## API Reference

### Global

**[appbase.newClient(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L10)**  

Returns a ``client`` object on which streaming requests can be performed.

> **args** - A set of key/value pairs that configures the ElasticSearch Index  
&nbsp;&nbsp;&nbsp;&nbsp;url: "https://scalr.api.appbase.io"  
&nbsp;&nbsp;&nbsp;&nbsp;appname: App name (equivalent to an ElasticSearch Index)  
&nbsp;&nbsp;&nbsp;&nbsp;username: App's username  
&nbsp;&nbsp;&nbsp;&nbsp;password: App's password key

### Client

**[client.streamDocument(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L44)** 

Get all the document changes as a stream. Returns a [``stream.Readable``](https://nodejs.org/api/stream.html#stream_class_stream_readable) object.

> **args** - A set of key/value pairs that makes the document URL  
&nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type, a string  
&nbsp;&nbsp;&nbsp;&nbsp;id: Valid Document ID

**[client.streamSearch(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L48)** 

Get all the query results as a stream. Returns a [``stream.Readable``](https://nodejs.org/api/stream.html#stream_class_stream_readable) object.

> **args** - A set of key/value pairs that makes the document URL  
&nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type, a string  
&nbsp;&nbsp;&nbsp;&nbsp;body: A JSON Query Body (Any query matching the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html))
