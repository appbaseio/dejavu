export default {
	Text: {
		type: 'text',
		fields: {
			keyword: {
				type: 'keyword',
				index: 'true',
				ignore_above: 256,
			},
			autosuggest: {
				type: 'text',
				index: 'true',
				analyzer: 'autosuggest_analyzer',
				search_analyzer: 'simple',
			},
		},
		analyzer: 'standard',
		search_analyzer: 'standard',
	},
	SearchableText: {
		type: 'text',
		fields: {
			keyword: {
				type: 'keyword',
				index: 'true',
				ignore_above: 256,
			},
			search: {
				type: 'text',
				index: 'true',
				analyzer: 'ngram_analyzer',
				search_analyzer: 'simple',
			},
			autosuggest: {
				type: 'text',
				index: 'true',
				analyzer: 'autosuggest_analyzer',
				search_analyzer: 'simple',
			},
		},
		analyzer: 'standard',
		search_analyzer: 'standard',
	},
	Long: {
		type: 'long',
	},
	Integer: {
		type: 'integer',
	},
	Double: {
		type: 'double',
	},
	Float: {
		type: 'float',
	},
	Date: {
		type: 'date',
	},
	Boolean: {
		type: 'boolean',
	},
	'Geo Point': {
		type: 'geo_point',
	},
	'Geo Shape': {
		type: 'geo_shape',
	},
	Image: {
		type: 'text',
		fields: {
			keyword: {
				type: 'keyword',
				index: 'true',
			},
		},
	},
};
