const extractColumns = mappings =>
	Object.keys((mappings || {}).properties || []);

const META_FIELDS = ['_index', '_type'];

const es6mappings = {
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

const getSortableTypes = () => {
	const sortableTypes = Object.keys(es6mappings).reduce((result, value) => {
		if (
			['Boolean', 'Geo Point', 'Geo Shape', 'Image'].indexOf(value) === -1
		) {
			result.push(es6mappings[value].type);
		}

		return result;
	}, []);

	return [...sortableTypes, 'string'];
};

const getTermsAggregationColumns = mappings => {
	const columns = [];

	if (mappings && mappings.properties) {
		Object.keys(mappings.properties).forEach(item => {
			if (mappings.properties[item].type === 'string') {
				if ((mappings.properties[item].fields || {}).raw) {
					columns.push(`${item}.raw`);
				} else {
					columns.push(item);
				}
			}

			if (
				mappings.properties[item].type === 'text' &&
				(mappings.properties[item].fields || {}).raw
			) {
				columns.push(`${item}.raw`);
			}
		});
	}

	return columns;
};

// eslint-disable-next-line
export {
	extractColumns,
	es6mappings,
	META_FIELDS,
	getSortableTypes,
	getTermsAggregationColumns,
};
