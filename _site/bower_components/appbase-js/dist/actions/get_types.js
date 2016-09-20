'use strict';

var through2 = require('through2');

var getTypesService = function getTypesService(client) {
	var resultStream = through2.obj(function (chunk, enc, callback) {
		var appname = Object.keys(chunk)[0];
		var types = Object.keys(chunk[appname]['mappings']).filter(function (type) {
			return type !== '_default_';
		});
		this.push(types);

		callback();
	});
	resultStream.writable = false;

	return client.performStreamingRequest({
		method: 'GET',
		path: '_mapping'
	}).pipe(resultStream);
};

module.exports = getTypesService;
