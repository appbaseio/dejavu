var Readable = require('stream').Readable;
var Guid = require('guid')
var querystring = require('querystring')
var through2 = require('through2')
var EventEmitter = require('events').EventEmitter

var wsRequest = function wsRequest(client, args) {
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

	return resultStream
}

wsRequest.prototype.init = function init() {
	var that = this

	this.id = Guid.raw()

	this.request = {
		id: this.id,
		path: this.client.appname + '/' + this.path + '?' + querystring.stringify(this.params),
		method: this.method,
		body: this.body,
		authorization: 'Basic ' + (new Buffer(this.client.username + ':' + this.client.password).toString('base64'))
	}

	this.resultStream = through2.obj()
	this.resultStream.writable = false

	this.client.ws.on('close', function() {
		that.resultStream.push(null)
	})

	this.client.ws.on('message', function(dataObj) {
		if(!dataObj.id && dataObj.message) {
			that.resultStream.emit('error', dataObj)
			return
		}

		if(dataObj.id === that.id) {
			if(dataObj.message) {
				delete dataObj.id
				that.resultStream.emit('error', dataObj)
				return
			}

			if(dataObj.query_id) {
				that.query_id = query_id
			}

			if(dataObj.channel)  {
				that.channel = dataObj.channel
			}

			if(dataObj.body && dataObj.body !== "") {
				that.resultStream.push(dataObj.body)
			}

			return
		}

		if(!dataObj.id && dataObj.channel && dataObj.channel === that.channel) {
			that.resultStream.push(dataObj.event)
			return
		}
	})

	this.client.ws.send(this.request)

	this.resultStream.on('end', function() {
		that.stop.apply(that)
	})

	this.resultStream.stop = function() {
		that.stop.apply(that)
	}
	this.resultStream.getId = function(callback) {
		that.getId.apply(that, [callback])
	}
	this.resultStream.reconnect = function() {
		that.reconnect.apply(that)
	}

	return this.resultStream
}

wsRequest.prototype.getId = function getId(callback) {
	if(this.query_id) {
		callback(this.query_id)
	} else {
		this.client.ws.on('message', function(data) {
			var dataObj = JSON.parse(data)
			if(dataObj.id === that.id) {
				if(dataObj.query_id) {
					callback(query_id)
				}
			}
		})
	}
}

wsRequest.prototype.stop = function stop() {
	this.resultStream.push(null)
	var unsubRequest = {}
	for(var key in this.request) {
		unsubRequest[key] = this.request[key]
	}
	unsubRequest.unsubscribe = true
	this.client.ws.send(unsubRequest)
}

wsRequest.prototype.reconnect = function reconnect() {
	this.stop()
	return new wsRequest(this.client, this.args)
}

module.exports = wsRequest