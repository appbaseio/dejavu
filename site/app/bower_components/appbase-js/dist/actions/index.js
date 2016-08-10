'use strict';

var helpers = require('../helpers');

var indexService = function indexService(client, args) {
	var valid = helpers.validate(args, {
		'type': 'string',
		'body': 'object'
	});
	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var id = args.id;
	var body = args.body;
	delete args.type;
	delete args.id;
	delete args.body;

	var path;
	if (id) {
		path = type + '/' + id;
	} else {
		path = type;
	}

	return client.performStreamingRequest({
		method: 'POST',
		path: path,
		params: args,
		body: body
	});
};

module.exports = indexService;
