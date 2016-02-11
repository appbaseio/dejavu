var murmur = require('murmur')

var helpers = require('../helpers')

var addWebhookService = function addWebhook(client, args, webhook) {
	var valid = helpers.validate(args, {
		'body': 'object'
	})
	if(valid !== true) {
		throw valid
		return
	}

	if(args.type === undefined || !(typeof args.type === 'string' || args.type.constructor === Array)
		|| (args.type === '' || args.type.length === 0) ) {
		throw new Error("fields missing: type")
		return
	}

	valid = helpers.validate(args.body, {
		'query': 'object'
	})
	if(valid !== true) {
		throw valid
		return
	}

	if(args.type.constructor === Array) {
		this.type = args.type
		this.type_string = args.type.join()
	} else {
		this.type = [args.type]
		this.type_string = args.type
	}

	this.webhooks = []
	this.client = client
	this.query = args.body.query

	if(typeof webhook === 'string') {
		var webhook_obj = {}
		webhook_obj.url = webhook
		webhook_obj.method = 'GET'
		this.webhooks.push(webhook_obj)
	} else if(webhook.constructor === Array) {
		this.webhooks = webhook
	} else if(webhook === Object(webhook)) {
		this.webhooks.push(webhook)
	} else {
		throw new Error('fields missing: second argument(webhook) is necessary')
		return
	}

	this.populateBody()

	var hash = murmur.hash128(JSON.stringify(this.query)).hex()
	var path = '.percolator/webhooks-0-' + this.type_string + '-0-' + hash

	this.path = path

	return this.performRequest('POST') 
}

addWebhookService.prototype.populateBody = function populateBody() {
	this.body = {}
	this.body.webhooks = this.webhooks
	this.body.query = this.query
	this.body.type = this.type
}

addWebhookService.prototype.performRequest = function performRequest(method){
	var res = this.client.performStreamingRequest({
		method: method,
		path: this.path,
		body: this.body
	})

	res.change = this.change.bind(this)
	res.stop = this.stop.bind(this)

	return res
}

addWebhookService.prototype.change = function change(args){
	this.webhooks = []

	if(typeof args === 'string') {
		var webhook = {}
		webhook.url = args
		webhook.method = 'POST'
		this.webhooks.push(webhook)
	} else if(args.constructor === Array) {
		this.webhooks = args
	} else if(args === Object(args)) {
		this.webhooks.push(args)
	} else {
		throw new Error('fields missing: one of webhook or url fields is required')
		return
	}

	this.populateBody()

	return this.performRequest('POST')
}

addWebhookService.prototype.stop = function stop(){
	delete this.body

	return this.performRequest('DELETE')
}

module.exports=addWebhookService