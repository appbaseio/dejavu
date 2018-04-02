const getMaxArrayView = (data) => {
	let separator = 0;
	let limit = 16;
	for (let i = 0; i < data.length && limit > 0; i += 1) {
		if(data[i]) {
			limit -= data[i].length;
			if (limit > 0) {
				separator += 1;
			}
			limit -= 2;
		}
	}
	return separator;
};

export default getMaxArrayView;
