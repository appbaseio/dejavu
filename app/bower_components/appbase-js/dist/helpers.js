'use strict';

function validate(object, fields) {
	/*
 example : fields : {
 'body':'string'
 }
 */
	var invalid = [];
	var empty_for = {
		'object': null,
		'string': ''
	};

	var keys = Object.keys(fields); // getting the types from the fields json

	for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var key = _ref;

		var type = fields[key];
		if (typeof object[key] !== type || object[key] === empty_for[type]) {
			invalid.push(key);
		}
	}

	var missing = '';
	for (var i = 0; i < invalid.length; i++) {
		missing += invalid[i] + ', ';
	}
	if (invalid.length > 0) {
		return new Error('fields missing: ' + missing);
	}

	return true;
}

module.exports = {
	validate: validate
};
