var streamSearchService = function streamSearchService(client, args) {
	this.args = args

	var valid = this.validate()
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var body = args.body
	delete args.type
	delete args.body

	return client.performStreamingRequest({
		method: 'POST',
		path: type + '/_search',
		params: args,
		body: body
	})
}

streamSearchService.prototype.validate = function validate() {
	var invalid = []
	if(typeof this.args.type !== 'string' || this.args.type === '') {
		invalid.push('type')
	}
	if(typeof this.args.body !== 'object' || this.args.body === null) {
		invalid.push('body')
	}

	var missing = ''
	for(var i=0;i<invalid.length;i++) {
		missing += (invalid[i] + ', ')
	}

	if(invalid.length > 0) {
		return new Error('fields missing: ' + missing)
	}

	return true
}

module.exports = streamSearchService