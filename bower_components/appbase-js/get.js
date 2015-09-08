var newStreamDocumentService = function newStreamDocumentService(client, args) {
	var getService = {}

	var validate = function validate() {
		var invalid = []
		if(args.type === "") {
			invalid += 'type'
		}
		if(args.id === "") {
			invalid += 'id'
		}

		if(invalid.length > 0) {
			return new Error('fields missing: ' + invalid[0])
		}

		return true
	}

	var valid = validate()
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var id = args.id
	delete args.type
	delete args.id

	args.stream = "true"

	return client.performStreamingRequest({
		method: 'GET',
		path: type + '/' + id,
		params: args,
	})
}

module.exports = newStreamDocumentService