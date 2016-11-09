/**
 * Expose `JSON.parse` method or fallback if not
 * exists on `window`
 */

module.exports = 'undefined' === typeof JSON
  ? require('json-fallback').parse
  : JSON.parse;
