var newStreamSearchService = function newStreamSearchService(client, args) {
	var searchService = {}

	var validate = function validate() {
		var invalid = []
		if(args.type === "") {
			invalid += 'type'
		}
		if(args.body === "") {
			invalid += 'body'
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
	var body = args.body
	delete args.type
	delete args.body

	args.stream = "true"

	return client.performStreamingRequest({
		method: 'POST',
		path: type + '/_search',
		params: args,
		body: body
	})
}

module.exports = newStreamSearchService