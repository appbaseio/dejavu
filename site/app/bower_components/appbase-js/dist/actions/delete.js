'use strict';

var helpers = require('../helpers');

var deleteService = function deleteService(client, args) {
	var valid = helpers.validate(args, {
		'type': 'string',
		'id': 'string'
	});
	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var id = args.id;
	delete args.type;
	delete args.id;

	var path = type + '/' + id;

	return client.performStreamingRequest({
		method: 'DELETE',
		path: path,
		params: args
	});
};

module.exports = deleteService;
