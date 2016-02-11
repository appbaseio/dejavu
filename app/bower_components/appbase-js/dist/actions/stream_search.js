'use strict';

var helpers = require('../helpers');

var streamSearchService = function streamSearchService(client, args) {
	var valid = helpers.validate(args, {
		'body': 'object'
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	if (args.type === undefined || !(typeof args.type === 'string' || args.type.constructor === Array) || (args.type === '' || args.type.length === 0)) {
		throw new Error("fields missing: type");
		return;
	}

	var type;
	if (args.type.constructor === Array) {
		type = args.type.join();
	} else {
		type = args.type;
	}

	var type = args.type;
	var body = args.body;
	delete args.type;
	delete args.body;
	delete args.stream;

	args.streamonly = 'true';

	return client.performWsRequest({
		method: 'POST',
		path: type + '/_search',
		params: args,
		body: body
	});
};

module.exports = streamSearchService;
