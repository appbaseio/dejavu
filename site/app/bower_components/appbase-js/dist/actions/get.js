'use strict';

var helpers = require('../helpers');

var getService = function getService(client, args) {
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
		method: 'GET',
		path: path,
		params: args
	});
};

module.exports = getService;
