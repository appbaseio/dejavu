"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkUpdate = exports.deleteData = exports.putData = exports.addData = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.replace");

var _utils = require("../utils");

var _CustomError = _interopRequireDefault(require("../utils/CustomError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const addData = async (indexName, typeName, docId, rawUrl, data, version) => {
  const defaultError = 'Unable to put data';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(indexName);
    let baseUrl = "".concat(url, "/").concat(indexName, "/").concat(typeName);
    let finalData = JSON.stringify(data);

    if (docId && !Array.isArray(data)) {
      baseUrl += "/".concat(docId);
    }

    if (Array.isArray(data)) {
      baseUrl += "/_bulk";
      finalData = '';
      data.forEach(item => {
        finalData += JSON.stringify({
          index: {
            _index: indexName,
            _type: typeName
          }
        });
        finalData += "\n".concat(JSON.stringify(item));
        finalData += "\n";
      });
    }

    if (version > 5) {
      baseUrl += "?refresh=wait_for";
    }

    const res = await fetch("".concat(baseUrl), {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders)),
      method: 'POST',
      body: finalData
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(res.message || defaultError));
    }

    return res;
  } catch (error) {
    throw new _CustomError.default(error.description || defaultError, error.message, error.stack);
  }
};

exports.addData = addData;

const putData = async (indexName, typeName, docId, rawUrl, data, version) => {
  const defaultError = 'Unable to put data';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(indexName);
    let baseUrl = "".concat(url, "/").concat(indexName, "/").concat(typeName, "/").concat(docId);

    if (version > 5) {
      baseUrl += '?refresh=wait_for';
    }

    const res = await fetch(baseUrl, {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders)),
      method: 'PUT',
      body: JSON.stringify(data)
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(res.message || defaultError));
    }

    return res;
  } catch (error) {
    throw new _CustomError.default(error.description || error.message || defaultError, error.message, error.stack);
  }
};

exports.putData = putData;

const deleteData = async (rawUrl, indexName, typeName, queryData) => {
  const defaultError = 'Unable to delete data';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(indexName);
    let query = {};

    if (Array.isArray(queryData)) {
      query = {
        query: {
          ids: {
            values: queryData
          }
        }
      };
    } else {
      query = {
        query: queryData
      };
    }

    const data = _objectSpread({}, query);

    const res = await fetch("".concat(url, "/").concat(indexName, "/").concat(typeName, "/_delete_by_query?wait_for_completion=true&scroll_size=5000"), {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders)),
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(res.message || defaultError));
    }

    return res;
  } catch (error) {
    throw new _CustomError.default(error.description || error.message || defaultError, error.message, error.stack);
  }
};

exports.deleteData = deleteData;

const bulkUpdate = async (rawUrl, indexName, typeName, queryData, updateData) => {
  const defaultError = 'Unable to update data';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(indexName);
    const dataMap = updateData.reduce((str, item) => {
      let tempStr = str;

      if (item.value !== null) {
        tempStr += "ctx._source.".concat(item.field, "=");

        if (typeof item.value === 'string') {
          tempStr += "\"".concat(item.value, "\";");
        } else {
          tempStr += "".concat(JSON.stringify(item.value).replace(/{/g, '[').replace(/}/g, ']'), ";");
        }
      }

      return tempStr;
    }, '');
    let query = {};

    if (Array.isArray(queryData)) {
      query = {
        query: {
          ids: {
            values: queryData
          }
        }
      };
    } else {
      query = {
        query: queryData
      };
    }

    const data = _objectSpread({}, query, {
      script: {
        inline: dataMap
      }
    });

    const res = await fetch("".concat(url, "/").concat(indexName, "/").concat(typeName, "/_update_by_query?conflicts=proceed&wait_for_completion=true&scroll_size=5000"), {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders)),
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(res.message || defaultError));
    }

    return res;
  } catch (error) {
    throw new _CustomError.default(error.description || error.message || defaultError, error.message, error.stack);
  }
};

exports.bulkUpdate = bulkUpdate;