"use strict";

require("core-js/modules/es6.regexp.search");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.searchAfter = exports.flatten = exports.MAX_DATA = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _apis = require("../apis");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let jsonData = [];
const MAX_DATA = 100000;
exports.MAX_DATA = MAX_DATA;
const defaultQuery = {
  query: {
    match_all: {}
  }
};
/**
 * A function to convert multilevel object to single level object and use key value pairs as Column and row pairs using recursion
 */

const flatten = data => {
  const result = {};

  function recurse(cur) {
    let prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      result[prop] = JSON.stringify(cur);
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach(p => {
        isEmpty = false;
        recurse(cur[p], prop ? "".concat(prop, ".").concat(p) : p);
      });

      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  }

  recurse(data);
  return result;
};

exports.flatten = flatten;

const searchAfter = async (app, types, url, version, query, chunkInfo, searchAfterData) => {
  try {
    const others = {};

    if (searchAfterData) {
      others.search_after = [searchAfterData];
    }

    const sortKey = version > 5 ? '_id' : '_uid';
    const data = await (0, _apis.search)(app, types, url, _objectSpread({}, query, {
      size: 1000,
      sort: [{
        [sortKey]: 'desc'
      }]
    }, others)); // eslint-disable-next-line

    const res = await getSearchAfterData(app, types, url, version, query, chunkInfo, searchAfterData, data);

    if (typeof res === 'string') {
      let exportData = JSON.parse(res);
      const lastObject = exportData[exportData.length - 1];
      exportData = exportData.map(value => {
        const item = Object.assign(value._source);
        return item;
      });
      return {
        data: exportData,
        searchAfter: version > 5 ? lastObject._id : "".concat(lastObject._type, "#").concat(lastObject._id)
      };
    }

    return res;
  } catch (e) {
    console.error('SEARCH ERROR', e);
    return e;
  }
};

exports.searchAfter = searchAfter;

const getSearchAfterData = async (app, types, url, version, query, chunkInfo, searchAfterData, data) => {
  const {
    hits
  } = data;
  let str = null;
  /**
   * Checking if the current length is less than chunk total, recursive call searchAfter
   */

  if (hits && jsonData.length < chunkInfo.total) {
    const {
      hits: totalhits,
      total
    } = hits;
    jsonData = jsonData.concat(totalhits);
    const lastObject = totalhits[totalhits.length - 1];
    const nextSearchData = version > 5 ? lastObject._id : "".concat(lastObject._type, "#").concat(lastObject._id);
    return searchAfter(app, types, url, version, query, chunkInfo, totalhits.length === total ? '' : nextSearchData);
  }

  str = JSON.stringify(jsonData, null, 4);
  jsonData = [];
  return str;
};
/**
 * Main function for getting data to be exported;
 * @param {*} app
 * @param {*} types
 * @param {*} url
 * @param {*} query
 * @param {*} searchAfter
 */


const exportData = async (app, types, url, version, query, chunkInfo, searchAfterData) => {
  try {
    const finalQuery = query || defaultQuery;
    const res = await searchAfter(app, types, url, version, finalQuery, chunkInfo, searchAfterData);
    return res;
  } catch (e) {
    return e;
  }
};

var _default = exportData;
exports.default = _default;