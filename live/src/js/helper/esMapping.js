export const es2 = {
	Text: {
		type: 'string',
		fields: {
			raw: {
				type: 'string',
				index: 'not_analyzed'
			},
			autosuggest: {
				type: 'string',
				index: 'analyzed',
				analyzer: 'autosuggest_analyzer'
			}
		},
		analyzer: 'standard',
		search_analyzer: 'standard'
	},
	SearchableText: {
		type: 'string',
		fields: {
			raw: {
				type: 'string',
				index: 'not_analyzed'
			},
			search: {
				type: 'string',
				index: 'analyzed',
				analyzer: 'ngram_analyzer'
			},
			autosuggest: {
				type: 'string',
				index: 'analyzed',
				analyzer: 'autosuggest_analyzer'
			}
		},
		analyzer: 'standard',
		search_analyzer: 'standard'
	},
	Long: {
		type: 'long'
	},
	Integer: {
		type: 'integer'
	},
	Double: {
		type: 'double'
	},
	Float: {
		type: 'float'
	},
	Date: {
		type: 'date'
	},
	Boolean: {
		type: 'boolean'
	},
	'Geo Point': {
		type: 'geo_point'
	},
	'Geo Shape': {
		type: 'geo_shape'
	},
	Image: {
		type: 'string',
		fields: {
			raw: {
				type: 'string',
				index: 'not_analyzed'
			}
		}
	}
};

export const es5 = {
	Text: {
		type: 'text',
		fields: {
			raw: {
				type: 'keyword',
				index: 'not_analyzed'
			},
			autosuggest: {
				type: 'text',
				index: 'analyzed',
				analyzer: 'autosuggest_analyzer'
			}
		},
		analyzer: 'standard',
		search_analyzer: 'standard'
	},
	SearchableText: {
		type: 'text',
		fields: {
			raw: {
				type: 'keyword',
				index: 'not_analyzed'
			},
			search: {
				type: 'text',
				index: 'analyzed',
				analyzer: 'ngram_analyzer'
			},
			autosuggest: {
				type: 'text',
				index: 'analyzed',
				analyzer: 'autosuggest_analyzer'
			}
		},
		analyzer: 'standard',
		search_analyzer: 'standard'
	},
	Long: {
		type: 'long'
	},
	Integer: {
		type: 'integer'
	},
	Double: {
		type: 'double'
	},
	Float: {
		type: 'float'
	},
	Date: {
		type: 'date'
	},
	Boolean: {
		type: 'boolean'
	},
	'Geo Point': {
		type: 'geo_point'
	},
	'Geo Shape': {
		type: 'geo_shape'
	},
	Image: {
		type: 'text',
		fields: {
			raw: {
				type: 'keyword',
				index: 'not_analyzed'
			}
		}
	}
};

export const dateFormats = [
	'epoch_millis',
	'epoch_second',
	'date_time',
	'date_time_no_millis',
	'date',
	'basic_date',
	'basic_date_time',
	'basic_date_time_no_millis',
	'basic_time',
	'basic_time_no_millis'
];

export const dateHints = {
	epoch_millis: '(default)',
	date: '(yyyy-MM-dd)',
	date_time: "(yyyy-MM-dd'T'HH:mm:ss.SSSZ)",	// eslint-disable-line
	date_time_no_millis: "(yyyy-MM-dd'T'HH:mm:ssZ)", // eslint-disable-line
	basic_date: '(yyyyMMdd)',
	basic_date_time: '(yyyyMMddTHH:mm:ss.SSSZ)',
	basic_date_time_no_millis: '(yyyyMMddTHH:mm:ssZ)',
	basic_time: '(HHmmss.SSSZ)',
	basic_time_no_millis: '(HHmmssZ)'
};
