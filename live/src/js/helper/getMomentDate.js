const getMomentDate = (format) => {
	switch (format) {
		case 'YYYY/MM/DD':
			return format;
		case 'basic_date':
			return 'YYYYMMDD';
		case 'epoch_millis':
			return 'x';
		case 'basic_date_time_no_millis':
			return 'YYYYMMDDTHHmmssZ';
		case 'date_time_no_millis':
			return 'YYYY-MM-DDTHH:mm:ss[Z]';
		case 'basic_date_time':
			return 'YYYYMMDDTHHmmss.SSSZ';
		default:
			return format;
	}
};

export default getMomentDate;
