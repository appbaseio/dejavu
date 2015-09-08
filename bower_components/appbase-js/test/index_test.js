var assert = require('assert')

var indexTests = {}

indexTests.indexOneDocument = function indexOneDocument(streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	streamingClient.index({
		type: 'tweet',
		id: '1',
		body: tweet
	}).on('data', function(res) {
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
				streamingClient.index({
					type: 'tweet',
					id: '1',
					body: tweet
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

module.exports = indexTests