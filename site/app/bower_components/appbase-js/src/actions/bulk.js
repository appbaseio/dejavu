var helpers = require('../helpers')

var bulkService = function bulkService(client, args) {
	var valid = helpers.validate(args, {
		'body': 'object'
	})
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var body = args.body
	delete args.type
	delete args.body

	var path
	if(type) {
		path = type + '/_bulk'
	} else {
		path = '/_bulk'
	}

	return client.performStreamingRequest({
		method: 'POST',
		path: path,
		params: args,
		body: body
	})
}


module.exports = bulkService
