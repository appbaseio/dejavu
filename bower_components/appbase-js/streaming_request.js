var hyperquest = require('hyperquest')
var JSONStream = require('JSONStream')
var querystring = require('querystring')

var streamingRequest = function streamingRequest(client, args) {
	this.client = client
	this.args = args

	this.method = args.method
	this.path = args.path
	this.params = args.params
	this.body = args.body
	if(!this.body || typeof this.body !== 'object') {
		this.body = {}
	}

	var resultStream = this.init()

	if(this.requestStream.writable) {
		this.requestStream.end(JSON.stringify(this.body))
	}

	return resultStream
}

streamingRequest.prototype.init = function init() {
	var that = this

	this.requestStream = hyperquest({
		method: this.method,
		uri: this.client.url + '/' + this.client.appname + '/' + this.path + '?' + querystring.stringify(this.params),
		auth: this.client.username + ':' + this.client.password
	})
	this.requestStream.on('response', function(res) {
		that.response = res
	})

	var resultStream = this.requestStream.pipe(JSONStream.parse())

	this.requestStream.on('end', function() {
		that.stop.apply(that)
	})

	resultStream.on('end', function() {
		that.stop.apply(that)
	})

	this.requestStream.on('error', function(err) {
		that.stop()
		process.nextTick(function() {
			resultStream.emit('error', err)
		})
	})

	resultStream.stop = function() {
		that.stop.apply(that)
	}
	resultStream.getId = function(callback) {
		that.getId.apply(that, [callback])
	}
	resultStream.reconnect = function() {
		that.reconnect.apply(that)
	}

	return resultStream
}

streamingRequest.prototype.getId = function getId(callback) {
	if(this.response) {
		callback(this.response.headers['query-id'])
	} else {
		this.requestStream.on('response', function(res) {
			callback(res.headers['query-id'])
		})
	}
}

streamingRequest.prototype.stop = function stop() {
	if(this.response) {
		this.response.destroy()
	} else {
		this.requestStream.on('response', function(res) {
			res.destroy()
		})
	}
}

streamingRequest.prototype.reconnect = function reconnect() {
	this.stop()
	return new streamingRequest(this.client, this.args)
}

module.exports = streamingRequest