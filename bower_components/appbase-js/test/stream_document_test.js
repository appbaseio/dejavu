var assert = require('assert')

var streamDocumentTests = {}

streamDocumentTests.streamOneDocument = function streamOneDocument(client, streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	client.index({
		index: 'createnewtestapp01',
		type: 'tweet',
		id: '1',
		body: tweet
	}, function(err, res) {
		if(err) {
			done(err)
			return
		}

		var first = true
		var responseStream = streamingClient.streamDocument({
			type: 'tweet',
			id: '1',
			stream: 'true'
		})
		responseStream.on('error', function(err) {
			if(err) {
				done(err)
				return
			}
		})
		responseStream.on('data', function(res) {
			if(first) {
				client.index({
					index: 'createnewtestapp01',
					type: 'tweet',
					id: '1',
					body: tweet
				}, function(err, res) {
					if(err) {
						done(err)
						return
					}
				})
				first = false
			} else {
				assert.deepEqual(res, {
			        _type: 'tweet',
			        _id: '1',
			        _source: tweet
				}, 'event not as expected')

				responseStream.pause()

				done()
			}
		})
	})
}

streamDocumentTests.stopStreamingDocument = function stopStreamingDocument(client, streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	client.index({
		index: 'createnewtestapp01',
		type: 'tweet',
		id: '1',
		body: tweet
	}, function(err, res) {
		if(err) {
			done(err)
			return
		}

		var first = true
		var responseStream = streamingClient.streamDocument({
			type: 'tweet',
			id: '1',
			stream: 'true'
		})
		responseStream.on('error', function(err) {
			if(err) {
				done(err)
				return
			}
		})
		responseStream.on('data', function(res) {
			if(first) {
				client.index({
					index: 'createnewtestapp01',
					type: 'tweet',
					id: '1',
					body: tweet
				}, function(err, res) {
					if(err) {
						done(err)
						return
					}
				})
				responseStream.stop()
				var waitForEvent = setTimeout(function () {
					done();
				}, 1000);
				first = false
			} else {
				done(new Error('Received second event'))
			}
		})
	})
}

module.exports = streamDocumentTests