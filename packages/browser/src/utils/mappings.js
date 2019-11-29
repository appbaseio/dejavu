import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import { dateFormatMap } from './date';

const extractColumns = (mappings, key) =>
	Object.keys((mappings || {})[key] || []);

const META_FIELDS = ['_index', '_type', '_score', '_click_id'];

const NUMERIC_DATATYPES = [
	'integer',
	'float',
	'long',
	'double',
	'short',
	'byte',
	'half_float',
	'scaled_float',
];

const es6mappings = {
	'Text: Aggs': {
		type: 'text',
		fields: {
			keyword: {
				type: 'keyword',
				index: 'true',
				ignore_above: 256,
			},
			english: {
				type: 'text',
				analyzer: 'english',
			},
		},
		analyzer: 'standard',
		search_analyzer: 'standard',
	},
	'Text: Search': {
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
			english: {
				type: 'text',
				analyzer: 'english',
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
		format: dateFormatMap.date,
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
	Keyword: {
		type: 'keyword',
		ignore_above: 256,
	},
};

const getSortableTypes = () => {
	const sortableTypes = Object.keys(es6mappings).reduce((result, value) => {
		if (['Geo Point', 'Geo Shape', 'Image'].indexOf(value) === -1) {
			result.push(es6mappings[value].type);
		}

		return result;
	}, []);

	return [...sortableTypes, 'string'];
};

const getSortableColumns = properties => {
	const columns = [];
	const sortableTypes = getSortableTypes();

	if (properties) {
		Object.keys(properties).forEach(item => {
			const { type } = properties[item];
			if (type && sortableTypes.indexOf(type) > -1) {
				if (
					properties[item].fields &&
					properties[item].fields.keyword
				) {
					columns.push(`${item}.keyword`);
				}

				if (properties[item].fields && properties[item].fields.raw) {
					columns.push(`${item}.raw`);
				}

				if (
					properties[item].originalFields &&
					properties[item].originalFields.keyword
				) {
					columns.push(`${item}.keyword`);
				}

				if (
					properties[item].originalFields &&
					properties[item].originalFields.raw
				) {
					columns.push(`${item}.raw`);
				}

				columns.push(item);
			}
		});
	}

	return columns;
};

const getTermsAggregationColumns = properties => {
	const columns = [];

	if (properties) {
		Object.keys(properties).forEach(item => {
			const { type } = properties[item];
			if (type === 'string') {
				if (
					(
						properties[item].originalFields ||
						properties[item].fields ||
						{}
					).raw
				) {
					columns.push(`${item}.raw`);
				} else if (
					(
						properties[item].originalFields ||
						properties[item].fields ||
						{}
					).keyword
				) {
					columns.push(`${item}.keyword`);
				} else {
					columns.push(item);
				}
			}

			if (type === 'text') {
				if (
					(
						properties[item].originalFields ||
						properties[item].fields ||
						{}
					).raw
				) {
					columns.push(`${item}.raw`);
				} else if (
					(
						properties[item].originalFields ||
						properties[item].fields ||
						{}
					).keyword
				) {
					columns.push(`${item}.keyword`);
				}
			}

			if (
				[
					es6mappings.Long.type,
					es6mappings.Integer.type,
					es6mappings.Double.type,
					es6mappings.Float.type,
					es6mappings.Date.type,
					es6mappings.Boolean.type,
					es6mappings.Keyword.type,
				].indexOf(type) > -1
			) {
				columns.push(item);
			}
		});
	}

	return columns;
};

const getFieldsTree = (mappings = {}, prefix = null) => {
	let tree = {};
	Object.keys(mappings).forEach(key => {
		if (mappings[key].properties) {
			tree = {
				...tree,
				...getFieldsTree(
					mappings[key].properties,
					`${prefix ? `${prefix}.` : ''}${key}`,
				),
			};
		} else {
			const originalFields = mappings[key].fields;
			tree = {
				...tree,
				[`${prefix ? `${prefix}.` : ''}${key}`]: {
					type: mappings[key].type,
					fields: mappings[key].fields
						? Object.keys(mappings[key].fields)
						: [],
					originalFields: originalFields || {},
				},
			};
		}
	});

	return tree;
};

const getMappingsTree = (mappings = {}) => {
	let tree = {};
	Object.keys(mappings).forEach(key => {
		if (mappings[key].properties) {
			tree = {
				...tree,
				...getFieldsTree(mappings[key].properties, key),
			};
		} else if (mappings[key].type) {
			tree = {
				...tree,
				[key]: mappings[key],
			};
		}
	});

	return tree;
};

const getNestedArrayField = (data, mappings) => {
	const fieldsToBeDeleted = {};
	const parentFields = {};
	const indexTypeMap = {};
	data.forEach(dataItem => {
		Object.keys(mappings).forEach(col => {
			if (!get(dataItem, col) && col.indexOf('.') > -1) {
				const parentPath = col.substring(0, col.lastIndexOf('.'));
				const parentData = get(dataItem, parentPath);
				if (parentData && Array.isArray(parentData)) {
					fieldsToBeDeleted[col] = true;
					parentFields[parentPath] = true;
					indexTypeMap[dataItem._index] = {
						[dataItem._type]: {
							...(indexTypeMap[dataItem._index]
								? indexTypeMap[dataItem._index][
										dataItem._type
								  ] || {}
								: {}),
							[parentPath]: true,
						},
					};
				}
			}
		});
	});

	return { parentFields, fieldsToBeDeleted, indexTypeMap };
};

// function to update mapping of particular type
const updateIndexTypeMapping = (
	currentMapping,
	updatingMap,
	fieldsToBeDeleted,
	fullMap,
) => {
	const newMapping = cloneDeep(currentMapping);
	Object.keys(updatingMap).forEach(index => {
		Object.keys(updatingMap[index]).forEach(type => {
			Object.keys(updatingMap[index][type]).forEach(key => {
				newMapping[index][type][key] = get(
					fullMap.properties,
					key.split('.').join('.properties.'),
				);
			});

			fieldsToBeDeleted.forEach(field => {
				delete newMapping[index][type][field];
			});
		});
	});

	return newMapping;
};

const hasNestedColumns = (originalProperties, nestedProperties) =>
	Object.keys(originalProperties).length !==
	Object.keys(nestedProperties).length;

export {
	extractColumns,
	es6mappings,
	META_FIELDS,
	getSortableTypes,
	getTermsAggregationColumns,
	getMappingsTree,
	getNestedArrayField,
	updateIndexTypeMapping,
	getSortableColumns,
	hasNestedColumns,
	NUMERIC_DATATYPES,
};
