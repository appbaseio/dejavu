function validate(object,fields) {
  /*
example : fields : {
  'body':'string'
}
  */
	var invalid = []
	var empty_for = {
		'object': null,
		'string': ''
	}

	var keys = Object.keys(fields) // getting the types from the fields json

	for(var key of keys) {
		var type = fields[key]
		if(typeof object[key] !== type || object[key] === empty_for[type]) {
			invalid.push(key)
		}
	}

	var missing = ''
	for(var i = 0; i < invalid.length; i++) {
		missing += invalid[i] + ', '
	}
	if(invalid.length > 0) {
		return new Error('fields missing: ' + missing)
	}

	return true
}

module.exports = {
  validate: validate
}
