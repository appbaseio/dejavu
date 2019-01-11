// converts elasticsearch date format to moment format
const dateFormatMap = {
	'YYYY/MM/DD': 'YYYY/MM/DD',
	basic_date: 'YYYYMMDD',
	date: 'YYYY-MM-DD',
	epoch_millis: 'x',
	epoch_second: 'X',
	basic_date_time_no_millis: 'YYYYMMDDTHHmmssZ',
	date_time_no_millis: 'YYYY-MM-DDTHH:mm:ss[Z]',
	basic_date_time: 'YYYYMMDDTHHmmss.SSSZ',
	date_time: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
	basic_time: 'HHmmss.SSSZ',
	basic_time_no_millis: 'HHmmssZ',
	'strict_date_optional_time||epoch_millis': 'YYYYMMDD',
};

const getDateFormat = format => {
	const momentFormat = dateFormatMap[format];
	return momentFormat || format;
};

export { dateFormatMap };
export default getDateFormat;
