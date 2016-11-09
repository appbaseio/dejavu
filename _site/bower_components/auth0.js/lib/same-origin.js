/**
 * Check for same origin policy
 */

module.exports = same_origin;

function same_origin (tprotocol, tdomain, tport) {
  var protocol = window.location.protocol;
  var domain = window.location.hostname;
  var port = window.location.port;

  tport = tport || '';
  return protocol === tprotocol && domain === tdomain && port === tport;
}
