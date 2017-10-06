const getMomentDate = (format) => {
	switch (format) {
		case 'YYYY/MM/DD':
			return format;
		case 'basic_date':
			return 'YYYYMMDD';
		case 'date':
			return 'YYYY-MM-DD';
		case 'epoch_millis':
			return 'x';
		case 'epoch_second':
			return 'X';
		case 'basic_date_time_no_millis':
			return 'YYYYMMDDTHHmmssZ';
		case 'date_time_no_millis':
			return 'YYYY-MM-DDTHH:mm:ss[Z]';
		case 'basic_date_time':
			return 'YYYYMMDDTHHmmss.SSSZ';
		case 'date_time':
			return 'YYYY-MM-DDTHH:mm:ss.SSSZ';
		case 'basic_time':
			return 'HHmmss.SSSZ';
		case 'basic_time_no_millis':
			return 'HHmmssZ';
		default:
			return format;
	}
};

export default getMomentDate;
