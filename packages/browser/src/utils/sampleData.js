import moment from 'dayjs';
import { META_FIELDS } from './mappings';
import getDateFormat from './date';

export const extractSource = data => {
	const source = { ...data };
	META_FIELDS.forEach(item => {
		delete source[item];
	});

	return source;
};

const getSampleData = properties => {
	const data = {};
	Object.keys(properties).forEach(item => {
		if (META_FIELDS.indexOf(item) === -1) {
			switch (properties[item].type) {
				case 'boolean':
					data[item] = false;
					break;
				case 'integer':
				case 'float':
				case 'long':
				case 'double':
					data[item] = 0;
					break;
				case 'date':
					data[item] = properties[item].format
						? moment().format(
								getDateFormat(properties[item].format),
						  )
						: moment().format('x');
					break;
				case 'object':
				case 'geo_point':
				case 'geo_shape':
					data[item] = {
						lat: '1.34',
						long: '2.4',
					};
					break;
				case 'string':
				case 'text':
				case 'keyword':
					data[item] = '';
					break;
				default:
					data[item] = {};
			}
		}
	});

	return data;
};

export default getSampleData;
