var ajs = Npm.require('appbase-js')
var Future = Npm.require('fibers/future')

Appbase = function Appbase(args) {
	if (!(this instanceof Appbase)) {
		return new Appbase(args)
	}

	this.ajsClient = new ajs(args)

	var client = {}

	client.index = this.varReturn.bind(this)("index")
	client.get = this.varReturn.bind(this)("get")
	client.update = this.varReturn.bind(this)("update")
	client.delete = this.varReturn.bind(this)("delete")
	client.bulk = this.varReturn.bind(this)("bulk")
	client.search = this.varReturn.bind(this)("search")
	client.searchStreamToURL = this.varReturn.bind(this)("searchStreamToURL")
	client.getTypes = this.varReturn.bind(this)("getTypes")

	client.getStream = this.ajsClient.getStream
	client.searchStream = this.ajsClient.searchStream

	return client
}

Appbase.prototype.varReturn = function varReturn(name) {
	return (function(...args) {
		var future = new Future
		this.ajsClient[name](...args)
			.on('data', Meteor.bindEnvironment(function(d) {
				future.return(d)
			}))
			.on('error', Meteor.bindEnvironment(function(e) {
				future.error(e)
			}))

		return future.wait()
	}).bind(this)
}