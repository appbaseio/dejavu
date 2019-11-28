"use strict";

require("core-js/modules/web.dom.iterable");

var _date = _interopRequireWildcard(require("../date"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

test('snapshot date formats', () => {
  expect(_date.dateFormatMap).toMatchSnapshot();
});
test('should return correct format if it exists', () => {
  const format = 'date';
  const res = (0, _date.default)(format);
  expect(res).toBe('YYYY-MM-DD');
});
test('should return custom format if it does not exist', () => {
  const format = 'YY/MM/DD';
  const res = (0, _date.default)(format);
  console.log('res', res);
  expect(res).toBe(format);
});