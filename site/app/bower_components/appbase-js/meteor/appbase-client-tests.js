Tinytest.addAsync('searchStream', function(test, next) {
	var c = new Appbase({
		url: 'http://QEVrcElba:5c13d943-a5d1-4b05-92f3-42707d49fcbb@scalr.api.appbase.io',
		appname: 'es2test1'
	})

	c.index({
		type: 'tweetx',
		id: '1',
		body: {
			foo: 'bar'
		}
	}).on('data', function(d) {
		var r = c.searchStream({
			type: 'tweetx',
			body: {
				query: {
					match_all: {}
				}
			}
		})
		r.on('data', function(data) {
			r.stop()
			test.equal(data._source.foo, 'boo')
			next()
		})
		r.on('error', function(err) {
			throw err
		})

		setTimeout(function() {
			c.index({
				type: 'tweetx',
				id: '1',
				body: {
					foo: 'boo'
				}
			}).on('error', function(err) {
				throw err
			})
		}, 2000)
	}).on('error', function(err) {
		throw err
	})
})