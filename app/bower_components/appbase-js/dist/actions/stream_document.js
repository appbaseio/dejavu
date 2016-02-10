'use strict';

var helpers = require('../helpers');

var streamDocumentService = function streamDocumentService(client, args) {
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
	delete args.stream;

	if (args.stream === true || args.stream === 'true') {
		args.stream = 'true';
	} else {
		delete args.stream;
		args.streamonly = 'true';
	}

	return client.performWsRequest({
		method: 'GET',
		path: type + '/' + id,
		params: args
	});
};

module.exports = streamDocumentService;
