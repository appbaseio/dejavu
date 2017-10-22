const getMaxArrayView = (data) => {
	let seperator = 0;
	let limit = 16;
	for (let i = 0; i < data.length && limit > 0; i += 1) {
		limit -= data[i].length;
		if (limit > 0) {
			seperator += 1;
		}
		limit -= 2;
	}
	return seperator;
};

export default getMaxArrayView;
