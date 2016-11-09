var IframeHandler = require('./IframeHandler');

var SilentAuthenticationHandler = function (auth0, authenticationUrl, timeout) {
  
  this.auth0 = auth0;
  this.authenticationUrl = authenticationUrl;
  this.timeout = timeout || 60 * 1000;
  this.handler = null;

}

SilentAuthenticationHandler.prototype.timeoutCallback = function () {

  console.error('Timeout during silent authentication.')

}

SilentAuthenticationHandler.prototype.login = function (callback, usePostMessage) {

  this.handler = new IframeHandler({
    auth0:this.auth0,
    url: this.authenticationUrl, 
    callback: callback, 
    timeout: this.timeout, 
    timeoutCallback: this.timeoutCallback,
    usePostMessage: usePostMessage || false
  });

  this.handler.init();

}


module.exports = SilentAuthenticationHandler;