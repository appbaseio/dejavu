"use strict";

var _ = require("..");

test('should parse url', () => {
  const rawUrl = 'https://abc:xyz@scalr.api.appbase.io';
  const {
    credentials,
    url
  } = (0, _.parseUrl)(rawUrl);
  expect(credentials).toBe('abc:xyz');
  expect(url).toBe('https://scalr.api.appbase.io');
});
test('should get url params', () => {
  const testQuery = '?appname=good-books-ds&url=https://abc:xyz@scalr.api.appbase.io';
  const expectedQueryObject = {
    appname: 'good-books-ds',
    url: 'https://abc:xyz@scalr.api.appbase.io'
  };
  expect((0, _.getUrlParams)(testQuery)).toEqual(expectedQueryObject);
});
test('should get headers', () => {
  const rawUrl = 'https://abc:xyz@scalr.api.appbase.io';
  const res = (0, _.getHeaders)(rawUrl);
  const expectedHeaders = {
    'Content-Type': 'application/json',
    Authorization: "Basic ".concat(btoa('abc:xyz'))
  };
  expect(res).toEqual(expectedHeaders);
});