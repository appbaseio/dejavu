# appbase-js

Appbase.io is a data streams library for Node.JS and Javascript (browser build is in the [browser/](https://github.com/appbaseio/appbase-js/tree/master/browser) directory); compatible with [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html).

An up-to-date documentation for Node.JS API is available at http://docs.appbase.io/scalr/javascript/nodejs-intro.html.

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
var Appbase = require('appbase-js')
var appbase = new Appbase({
		url: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
		appname: APPNAME
	});
appbase.index({
    type: "product",
    id: "1",
    body: {
        name: 'A green door',
        price: 12.50,
        tags: ['home', 'green'],
        stores: ['Walmart', 'Target']
    }
}).on('data', function(res) {
    console.log(res);
}).on('error', function(err) {
	console.log(err);
});
```

#### Step 2: Read the data stream from a particular DB location

Returns continous updates on a JSON document from a particular ``type``.

```js
appbase.getStream({
      type: 'product',
      id: '1'
}).on('data', function(res) {
      // 'data' handler is triggered every time there is a **new** document update.
      console.log(res);
}).on('error', function(err) {
      console.log("caught a stream error", err);
})
```

``Note:`` Existing document value is returned via ``get()`` method.

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

getStream() returns a ``stream.Readable`` object, which can be conveniently listened via the 'on("data")' event listener. Check out the [stream_document_test.js](https://github.com/appbaseio/appbase-js/blob/master/test/stream_document_test.js) where we make an update to the document and see any further updates to it via the 'data' event. 

#### Step 3: Apply queries on data streams

Get continuous results by searching across the database streams. A query can be written using the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) - which supports composing boolean, regex, geo, fuzzy, range queries. Let's stream the results of a simple **``match_all``** query on the ``product`` type:

```js
appbase.searchStream({
	type: 'product',
	body: {
		query: {
			match_all: {}
		}
	}
}).on('data', function(res, err) {
	console.log(res);
}).on('error', function(err) {
	console.log("caught a stream error", err);
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

searchStream() also returns a ``stream.Readable`` object, which can be conveniently listened via the 'on("data")' event listener. Check out the [stream_search_test.js](https://github.com/appbaseio/appbase-js/blob/master/test/stream_search_test.js) where we make an update that matches the query and see the results in the event stream. 


## API Reference

For a complete API reference, check out [JS API Ref doc](http://docs.appbase.io/scalr/javascript/api-reference.html).

### Global

**[new Appbase(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L16)**  

Returns a **reference** object on which streaming requests can be performed.

> **args** - A set of key/value pairs that configures the ElasticSearch Index  
&nbsp;&nbsp;&nbsp;&nbsp;url: "https://scalr.api.appbase.io"  
&nbsp;&nbsp;&nbsp;&nbsp;appname: App name (equivalent to an ElasticSearch Index)  
&nbsp;&nbsp;&nbsp;&nbsp;username: App's username  
&nbsp;&nbsp;&nbsp;&nbsp;password: App's password key

Optionally (and like in the quick example above), ``url`` can contain username and password fields in the format: https://&lt;USERNAME>:&lt;PASSWORD>@scalr.appbase.io.

### Reference

**[reference.getStream(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L99)** 

Get continuous updates on a JSON document with a ``type`` and ``id``. Returns a [``stream.Readable``](https://nodejs.org/api/stream.html#stream_class_stream_readable) object.

> **args** - A set of key/value pairs that makes the document URL  
&nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type, a string  
&nbsp;&nbsp;&nbsp;&nbsp;id: Valid Document ID

**[reference.searchStream(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L103)** 

Get continuous updates on search queries (fuzzy, boolean, geolocation, range, full-text). Returns a [``stream.Readable``](https://nodejs.org/api/stream.html#stream_class_stream_readable) object.

> **args** - A set of key/value pairs that makes the document URL  
&nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type, a string  
&nbsp;&nbsp;&nbsp;&nbsp;body: A JSON Query Body (Any query matching the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html))
