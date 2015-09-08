var assert = require('assert')

var streamSearchTests = {}

streamSearchTests.streamMatchAll = function streamMatchAll(client, streamingClient, done) {
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
		var responseStream = streamingClient.streamSearch({
			type: 'tweet',
			body: {
				query: {
					match_all: {}
				}
			},
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
				setTimeout(function() {
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
				}, 2000)
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

module.exports = streamSearchTests