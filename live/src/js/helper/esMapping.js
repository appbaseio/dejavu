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
	'Geo Shape': {
		type: 'geo_shape'
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
	'Geo Shape': {
		type: 'geo_shape'
	}
};
