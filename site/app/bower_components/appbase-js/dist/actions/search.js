'use strict';

var helpers = require('../helpers');

var searchService = function searchService(client, args) {
	var valid = helpers.validate(args, {
		'body': 'object'
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	var type;
	if (args.type.constructor === Array) {
		type = args.type.join();
	} else {
		type = args.type;
	}

	var body = args.body;
	delete args.type;
	delete args.body;

	var path;
	if (type) {
		path = type + '/_search';
	} else {
		path = '/_search';
	}

	return client.performStreamingRequest({
		method: 'POST',
		path: path,
		params: args,
		body: body
	});
};

module.exports = searchService;
