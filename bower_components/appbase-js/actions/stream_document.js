var streamDocumentService = function streamDocumentService(client, args) {
	this.args = args

	var valid = this.validate()
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var id = args.id
	delete args.type
	delete args.id

	return client.performWsRequest({
		method: 'GET',
		path: type + '/' + id,
		params: args,
	})
}

streamDocumentService.prototype.validate = function validate() {
	var invalid = []
	if(typeof this.args.type !== 'string' || this.args.type === '') {
		invalid.push('type')
	}
	if(typeof this.args.id !== 'string' || this.args.id === '') {
		invalid.push('id')
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

module.exports = streamDocumentService