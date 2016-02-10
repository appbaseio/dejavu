Package.describe({
	name: 'appbaseio:appbase',
	version: '0.10.7',
	summary: 'Appbase.io streaming client library for Meteor',
	git: 'https://github.com/appbaseio/appbase-js',
	documentation: 'meteor/README.md'
});

Npm.depends({
	"appbase-js": "0.10.7"
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.1');
	api.use('ecmascript');
	api.use('reactive-var');

	api.addFiles('meteor/appbase.js', 'server');
	api.addFiles('browser/appbase.min.js', 'client');

	api.export('Appbase', 'server');
	api.export('appbase', 'client');
});

Package.onTest(function(api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('appbaseio:appbase');
	api.addFiles('meteor/appbase-server-tests.js', 'server');
	api.addFiles('meteor/appbase-client-tests.js', 'client');
});