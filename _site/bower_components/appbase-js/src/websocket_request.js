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
	if (!this.body || typeof this.body !== 'object') {
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
		authorization: 'Basic ' + (new Buffer(this.client.credentials).toString('base64'))
	}

	this.resultStream = through2.obj()
	this.resultStream.writable = false

	this.closeHandler = function() {
		that.wsClosed.apply(that)
	}
	this.errorHandler = function(err) {
		that.processError.apply(that, [err])
	}
	this.messageHandler = function(dataObj) {
		that.processMessage.apply(that, [dataObj])
	}

	this.client.ws.on('close', this.closeHandler)
	this.client.ws.on('error', this.errorHandler)
	this.client.ws.on('message', this.messageHandler)

	this.client.ws.send(this.request)

	this.resultStream.on('end', function() {
		that.resultStream.readable = false
		that.stop.apply(that)
	})

	this.resultStream.stop = this.stop.bind(this)
		//this.resultStream.getId = this.getId.bind(this)
	this.resultStream.reconnect = this.reconnect.bind(this)

	return this.resultStream
}

wsRequest.prototype.wsClosed = function wsClosed() {
	this.resultStream.push(null)
}

wsRequest.prototype.processError = function processError(err) {
	this.resultStream.emit('error', err)
}

wsRequest.prototype.processMessage = function processMessage(origDataObj) {
	var dataObj = JSON.parse(JSON.stringify(origDataObj))

	if (!dataObj.id && dataObj.message) {
		this.resultStream.emit('error', dataObj)
		return
	}

	if (dataObj.id === this.id) {
		if (dataObj.message) {
			delete dataObj.id
			this.resultStream.emit('error', dataObj)
			return
		}

		if (dataObj.query_id) {
			this.query_id = dataObj.query_id
		}

		if (dataObj.channel) {
			this.channel = dataObj.channel
		}

		if (dataObj.body && dataObj.body !== "") {
			this.resultStream.push(dataObj.body)
		}

		return
	}

	if (!dataObj.id && dataObj.channel && dataObj.channel === this.channel) {
		this.resultStream.push(dataObj.event)
		return
	}
}

wsRequest.prototype.getId = function getId(callback) {
	if (this.query_id) {
		callback(this.query_id)
	} else {
		this.client.ws.on('message', function gid(data) {
			var dataObj = JSON.parse(data)
			if (dataObj.id === that.id) {
				if (dataObj.query_id) {
					this.client.ws.removeListener('message', gid)
					callback(query_id)
				}
			}
		})
	}
}

wsRequest.prototype.stop = function stop() {
	this.client.ws.removeListener('close', this.closeHandler)
	this.client.ws.removeListener('error', this.errorHandler)
	this.client.ws.removeListener('message', this.messageHandler)
	if (this.resultStream.readable) {
		this.resultStream.push(null)
	}
	var unsubRequest = JSON.parse(JSON.stringify(this.request))
	unsubRequest.unsubscribe = true
	if (this.unsubscribed !== true) {
		this.client.ws.send(unsubRequest)
	}
	this.unsubscribed = true
}

wsRequest.prototype.reconnect = function reconnect() {
	this.stop()
	return new wsRequest(this.client, this.args)
}

module.exports = wsRequest