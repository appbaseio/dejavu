"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.dateFormatMap = void 0;

require("core-js/modules/es6.regexp.split");

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
  strict_date_optional_time: 'YYYYMMDD',
  date_hour_minute_second: 'YYYY-MM-DDTHH:mm:ss',
  strict_date_hour_minute_second: 'YYYY-MM-DDTHH:mm:ss'
};
exports.dateFormatMap = dateFormatMap;

const getDateFormat = format => {
  let momentFormat = format;

  if (format.indexOf('||') > -1) {
    const formats = format.split('||');
    const availableFormat = formats.find(dateFormat => dateFormatMap[dateFormat]);

    if (availableFormat) {
      momentFormat = dateFormatMap[availableFormat];
    }
  } else {
    momentFormat = dateFormatMap[format] || format;
  }

  return momentFormat;
};

var _default = getDateFormat;
exports.default = _default;