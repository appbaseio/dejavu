# Meteor API Quickstart

Appbase is a minimalistic library for data streams.

It can:

* Continuously stream updates to documents, queries or filters over websockets (for browsers) and http-streams.
* Index new documents or update / delete existing ones. 

It can be added to a meteor project by running

```bash
meteor add appbaseio:appbase
```

## Using it client-side

You can read the [Javascript](http://docs.appbase.io/scalr/javascript/javascript-intro.html) quick-start guide for basic usage. 

The API reference for using the library client-side can be found [here](http://docs.appbase.io/scalr/javascript/api-reference.html).

## Using it server-side

First, create a new Appbase reference like you would on the client. 

The only difference between the client and server libraries is that all methods on the server except ``getStream`` and ``searchStream`` are synchronous. 

### Creating an Appbase reference

```js
var appbaseRef = new Appbase({
	"url": "https://scalr.api.appbase.io",
	"appname": <YOUR_APP_NAME>,
	"username": <APP_CREDENTIAL>,
	"password": <APP_SECRET>
})
```

### Writing data 

An example using the ``index`` method is given below. Other methods like ``update``, ``get``, ``delete``, ``search`` and ``searchStreamToURL`` can be used in a similar manner. 

Refer to the client-side [documentation](http://docs.appbase.io/scalr/javascript/api-reference.html) for the parameters they can take. 

#### index()

Writes a JSON data object at a given ``type`` and ``id`` location, or replaces if an object already exists.

```js
var response = appbaseRef.index({
  type: "tweet",
  id: "aX12c5",
  body: {
    "msg": "writing my first tweet!",
    "by": "jack",
    "using": ["appbase.io", "javascript", "streams"],
    "test": true
  }
})

console.log("index response: ", response)
```

## Streaming Data

The streaming methods are ``searchStream`` and ``getStream``.

Streaming is done in a similar way on both client and server. An example using ``searchStream`` is given below. 

### searchStream()

``searchStream()`` subscribes to search results on new document inserts, existing search results can be fetched via ``search()`` method.

The reactive array used below can be installed using

```bash
meteor add manuel:reactivearray
```

#### client-side 

```js
var request = {
  type: "tweet",
  body: {
    query: {
      match_all: {}
    }
  }
}

var r

appbaseRef.search(request).on('data', function(initres) {
	r = new ReactiveArray(initres.hits.hits)

	appbaseRef.searchStream(request).on('data', function(res) {
	  r.push(res)
	}).on('error', function(res) {
	  console.log("query error: ", res)
	})
})
```

#### server-side 

```js
var request = {
  type: "tweet",
  body: {
    query: {
      match_all: {}
    }
  }
}

var r = new ReactiveArray(appbaseRef.search(request).hits.hits)
appbaseRef.searchStream(request).on('data', Meteor.bindEnvironment(function(res) {
  r.push(res)
})).on('error', Meteor.bindEnvironment(function(res) {
  console.log("query error: ", res)
}))
```

**Returns**

[stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) ``Object`` with

- ``'data'`` and ``'error'`` event handlers
- a **stop()** method to stop the stream

```js
var responseStream = appbaseRef.searchStream({
  type: "tweet",
  body: {
    query: {
      match_all: {}
    }
  }
})

responseStream.on('data', Meteor.bindEnvironment(function(res) {
  console.log("data update: ", res)
}))

setTimeout(responseStream.stop, 5000) // stop stream after 5s
```
