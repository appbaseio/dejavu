const getSampleData = properties => {
	const data = {};
	Object.keys(properties).forEach(item => {
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
				data[item] = new Date();
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
				data[item] = '';
				break;
			default:
				data[item] = {};
		}
	});

	return data;
};

export default getSampleData;
