"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getDateFormat", {
  enumerable: true,
  get: function get() {
    return _date.default;
  }
});
exports.isExtension = exports.getImporterBaseUrl = exports.normalizeSearchQuery = exports.convertToMax = exports.trimUrl = exports.getCloneLink = exports.saveAppToLocalStorage = exports.isEqualArray = exports.isMultiIndexApp = exports.getCustomHeaders = exports.convertArrayToHeaders = exports.getOnlySource = exports.numberWithCommas = exports.setLocalStorageData = exports.getLocalStorageItem = exports.updateQueryStringParameter = exports.isObject = exports.isEmptyObject = exports.isVaildJSON = exports.getHeaders = exports.getUrlParams = exports.parseUrl = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.search");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.replace");

var _urlParserLite = _interopRequireDefault(require("url-parser-lite"));

var _date = _interopRequireDefault(require("./date"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const parseUrl = url => {
  if (!url) {
    return {
      credentials: null,
      url: null
    };
  }

  const {
    auth
  } = (0, _urlParserLite.default)(url);
  const filteredUrl = auth ? url.replace("".concat(auth, "@"), '') : url;
  return {
    credentials: auth,
    url: filteredUrl
  };
}; // convert search params to object


exports.parseUrl = parseUrl;

const getUrlParams = url => {
  if (!url) {
    // treat a falsy value as having no params
    return {};
  }

  const searchParams = new URLSearchParams(url);
  return Array.from(searchParams.entries()).reduce((allParams, _ref) => {
    let [key, value] = _ref;
    return _objectSpread({}, allParams, {
      [key]: value
    });
  }, {});
};

exports.getUrlParams = getUrlParams;

const getHeaders = rawUrl => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (!rawUrl) {
    return headers;
  }

  const {
    credentials
  } = parseUrl(rawUrl);

  if (credentials) {
    headers.Authorization = "Basic ".concat(btoa(credentials));
  }

  return headers;
};

exports.getHeaders = getHeaders;

const isVaildJSON = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

exports.isVaildJSON = isVaildJSON;

const isEmptyObject = obj => {
  if (obj === null) return true;
  if (!Object.keys(obj).length) return true;
  return false;
};

exports.isEmptyObject = isEmptyObject;

const isObject = obj => obj !== undefined && obj !== null && obj.constructor === Object;

exports.isObject = isObject;

const updateQueryStringParameter = (uri, key, value) => {
  const re = new RegExp("([?&])".concat(key, "=.*?(&|$)"), 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';

  if (uri.match(re)) {
    return uri.replace(re, "$1".concat(key, "=").concat(value, "$2"));
  }

  return "".concat(uri).concat(separator).concat(key, "=").concat(value);
}; // get localStorage data


exports.updateQueryStringParameter = updateQueryStringParameter;

const getLocalStorageItem = item => window.localStorage.getItem(item) || null; // set localStorage data


exports.getLocalStorageItem = getLocalStorageItem;

const setLocalStorageData = (item, data) => window.localStorage.setItem(item, data);

exports.setLocalStorageData = setLocalStorageData;

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

exports.numberWithCommas = numberWithCommas;

const getOnlySource = data => {
  const {
    _id,
    _index,
    _type,
    _score,
    _click_id,
    // eslint-disable-line
    highlight
  } = data,
        others = _objectWithoutProperties(data, ["_id", "_index", "_type", "_score", "_click_id", "highlight"]);

  return others;
};

exports.getOnlySource = getOnlySource;

const convertArrayToHeaders = data => {
  const headers = {};

  if (data.length) {
    data.forEach(item => {
      headers[item.key] = item.value;
    });
    return headers;
  }

  return {};
};

exports.convertArrayToHeaders = convertArrayToHeaders;

const saveAppToLocalStorage = (appname, url) => {
  let localConnections = JSON.parse(getLocalStorageItem(_constants.LOCAL_CONNECTIONS));

  if (!localConnections) {
    localConnections = {
      pastApps: []
    };
  }

  const {
    pastApps
  } = localConnections;
  const currentApp = pastApps.findIndex(item => item.appname === appname);

  if (currentApp === -1) {
    pastApps.push({
      appname,
      url,
      headers: []
    });
  } else {
    pastApps[currentApp] = _objectSpread({
      appname,
      url
    }, pastApps[currentApp]);
  }

  setLocalStorageData(_constants.LOCAL_CONNECTIONS, JSON.stringify({
    pastApps
  }));
};

exports.saveAppToLocalStorage = saveAppToLocalStorage;

const getCustomHeaders = appname => {
  let localConnections = JSON.parse(getLocalStorageItem(_constants.LOCAL_CONNECTIONS));

  if (!localConnections) {
    setLocalStorageData(_constants.LOCAL_CONNECTIONS, JSON.stringify({
      pastApps: []
    }));
    localConnections = {
      pastApps: []
    };
  }

  const {
    pastApps
  } = localConnections;

  if (pastApps) {
    const currentApp = pastApps.find(item => item.appname === appname);

    if (currentApp && currentApp.headers) {
      return currentApp.headers;
    }
  }

  return [];
};

exports.getCustomHeaders = getCustomHeaders;

const isMultiIndexApp = appname => appname.indexOf('*') > -1 || appname.indexOf(',') > -1;

exports.isMultiIndexApp = isMultiIndexApp;

const isEqualArray = function isEqualArray() {
  let array1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let array2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (array1.length !== array2.length) {
    return false;
  } // eslint-disable-next-line


  for (let i = 0; i < array1.length; i++) {
    if (array1[i]._id !== array2[i]._id) {
      return false;
    }
  }

  return true;
};

exports.isEqualArray = isEqualArray;

const isExtension = () => window.location.href.indexOf('chrome-extension') > -1;

exports.isExtension = isExtension;

const getImporterBaseUrl = () => {
  if (isExtension()) {
    return '/importer/index.html';
  }

  return '/importer/';
};

exports.getImporterBaseUrl = getImporterBaseUrl;

const getCloneLink = (appname, rawUrl) => {
  const {
    importUrl
  } = getUrlParams(window.location.search);
  let params = importUrl || getImporterBaseUrl();

  if (importUrl) {
    params += '?';
  } else {
    params += "".concat(window.location.search, "&sidebar=true&");
  }

  if (rawUrl.indexOf('appbase.io') > 1) {
    params += "app={\"importFrom\":{\"appname\":\"".concat(appname, "\",\"hosturl\":\"").concat(rawUrl, "\"},\"platform\":\"appbase\"}");
  } else {
    params += "app={\"importFrom\":{\"appname\":\"".concat(appname, "\",\"hosturl\":\"").concat(rawUrl, "\"},\"platform\":\"es\"}");
  }

  return params;
};

exports.getCloneLink = getCloneLink;

const trimUrl = url => {
  if (url.lastIndexOf('/') === url.length - 1) {
    return url.slice(0, -1);
  }

  return url;
};

exports.trimUrl = trimUrl;

const convertToMax = (number, max) => {
  const numberLength = number.toString().length;
  const maxLength = max.toString().length;

  if (numberLength !== maxLength) {
    return '0'.repeat(maxLength - numberLength) + number.toString();
  }

  return number;
};

exports.convertToMax = convertToMax;

const normalizeSearchQuery = query => {
  let normalizedQuery = query;

  if (normalizedQuery && normalizedQuery[1] === '&') {
    normalizedQuery = normalizedQuery.replace('&', '');
  }

  return normalizedQuery;
};

exports.normalizeSearchQuery = normalizeSearchQuery;