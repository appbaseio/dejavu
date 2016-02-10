Tinytest.add('index', function(test) {
	var c = new Appbase({
		url: 'http://QEVrcElba:5c13d943-a5d1-4b05-92f3-42707d49fcbb@scalr.api.appbase.io',
		appname: 'es2test1'
	})

	var r = c.index({
		type: 'tweet',
		id: '1',
		body: {
			foo: 'bar'
		}
	})

	test.equal(r._id, '1')
})

Tinytest.addAsync('searchStream', function(test, next) {
	var c = new Appbase({
		url: 'http://QEVrcElba:5c13d943-a5d1-4b05-92f3-42707d49fcbb@scalr.api.appbase.io',
		appname: 'es2test1'
	})

	c.index({
		type: 'tweet',
		id: '1',
		body: {
			foo: 'bar'
		}
	})

	var r = c.searchStream({
		type: 'tweet',
		body: {
			query: {
				match_all: {}
			}
		}
	})
	r.on('data', Meteor.bindEnvironment(function(data) {
		r.stop()
		test.equal(data._source.foo, 'boo')
		next()
	}))

	setTimeout(Meteor.bindEnvironment(function() {
		c.index({
			type: 'tweet',
			id: '1',
			body: {
				foo: 'boo'
			}
		})
	}), 2000)
})