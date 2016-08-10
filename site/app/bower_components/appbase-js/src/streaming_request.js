var hyperquest = require('hyperquest')
var JSONStream = require('JSONStream')
var querystring = require('querystring')
var through2 = require('through2')

var streamingRequest = function streamingRequest(client, args) {
	this.client = client
	this.args = args

	this.method = args.method
	this.path = args.path
	this.params = args.params
	this.body = args.body
	if(!this.body || !(typeof this.body === 'object' || this.body.constructor === Array) ) {
		this.body = {}
	}
	if(this.body.constructor === Array) {
		var arrayBody = this.body
		this.body = ''
		for(var i=0; i<arrayBody.length; i++) {
			this.body += JSON.stringify(arrayBody[i])
			this.body += '\n'
		}
	}

	var resultStream = this.init()

	return resultStream
}

streamingRequest.prototype.init = function init() {
	var that = this

	this.requestStream = hyperquest({
		method: this.method,
		uri:  this.client.protocol + '//' + this.client.url + '/' + this.client.appname + '/' + this.path + '?' + querystring.stringify(this.params),
		auth: this.client.credentials
	})
	this.requestStream.on('response', function(res) {
		that.response = res
	})
	this.requestStream.on('request', function(req) {
		that.request = req
	})

	var resultStream = this.requestStream.pipe(JSONStream.parse()).pipe(through2.obj())

	this.requestStream.on('end', function() {
		that.stop.apply(that)
	})

	resultStream.on('end', function() {
		that.stop.apply(that)
	})

	this.requestStream.on('error', function(err) {
		that.stop.apply(that)
		process.nextTick(function() {
			resultStream.emit('error', err)
		})
	})

	resultStream.stop = this.stop.bind(this)
	//resultStream.getId = this.getId.bind(this)
	resultStream.reconnect = this.reconnect.bind(this)
	if(this.requestStream.writable) {
		if(typeof this.body === 'string') {
			this.requestStream.end(this.body)
		} else {
			this.requestStream.end(JSON.stringify(this.body))
		}
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
	if(this.request) {
		this.request.destroy()
	} else {
		this.requestStream.on('request', function(req) {
			req.destroy()
		})
	}
}

streamingRequest.prototype.reconnect = function reconnect() {
	this.stop()
	return new streamingRequest(this.client, this.args)
}

module.exports = streamingRequest