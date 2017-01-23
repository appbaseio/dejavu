![](https://cdn.auth0.com/resources/oss-source-large-2x.png)

# Auth0.js
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[Auth0](http://auth0.com) is an authentication broker that supports social identity providers as well as enterprise identity providers such as Active Directory, LDAP, Office365, Google Apps, Salesforce.

Auth0.js is a client-side library for [Auth0](http://auth0.com). It allows you to trigger the authentication process and parse the [JWT](http://openid.net/specs/draft-jones-json-web-token-07.html) (JSON web token) with just the Auth0 `clientID`. Once you have the JWT you can use it to authenticate requests to your http API and validate the JWT in your server-side logic with the `clientSecret`.

## Example

The example directory has a ready-to-go app. In order to run it you need [node](http://nodejs.org/) installed, download dependencies with `npm install`, then execute `npm run example` from the root of this project.

### Initialize

Construct a new instance of the Auth0 client as follows:

```html
<script src="//cdn.auth0.com/w2/auth0-7.6.1.min.js"></script>
<script type="text/javascript">
  var auth0 = new Auth0({
    domain:       'mine.auth0.com',
    clientID:     'dsa7d77dsa7d7',
    callbackURL:  'http://my-app.com/callback',
    responseType: 'token'
  });

  //...
</script>
```

### Login

This method can be called as indifferently as `signin` or `login`.
Triggers the login on any of your active identity provider as follows:

```js
  //trigger login with google
  $('.login-google').click(function () {
    auth0.login({
      connection: 'google-oauth2'
    });
  });

  //trigger login with github
  $('.login-github').click(function () {
    auth0.login({
      connection: 'github'
    });
  });

  //trigger login with an enterprise connection
  $('.login-microsoft').click(function () {
    auth0.login({
      connection: 'contoso.com'
    });
  });

  //trigger login with a db connection
  $('.login-dbconn').click(function () {
    auth0.login({
      connection: 'db-conn',
      username:   $('.username').val(),
      password:   $('.password').val(),
    });
  });

  //trigger login with a db connection and avoid the redirect
  $('.login-dbconn').click(function () {
    auth0.login({
      connection: 'db-conn',
      username:   $('.username').val(),
      password:   $('.password').val(),
    },
    function (err, result) {
      // store in cookies
    });
  });

  //trigger login popup with google
  $('.login-google-popup').click(function (e) {
    e.preventDefault();
    auth0.login({
      connection: 'google-oauth2',
      popup: true,
      popupOptions: {
        width: 450,
        height: 800
      }
    }, function(err, result) {
      if (err) {
        alert("something went wrong: " + err.message);
        return;
      }
      alert('Hello!');
    });
  });
```

You can also request scopes that are not were not configured for the connection.

```js
  //trigger login requesting additional scopes with google
  $('.login-google').click(function () {
    auth0.login({
      connection: 'google-oauth2',
      connection_scope: ['https://www.googleapis.com/auth/orkut', 'https://picasaweb.google.com/data/']
    });
  });

  // alternatively a comma separated list also works
  $('.login-google').click(function () {
    auth0.login({
      connection: 'google-oauth2',
      connection_scope: 'https://www.googleapis.com/auth/orkut,https://picasaweb.google.com/data/'
    });
  });
```

Trigger the login with offline mode support to get the `refresh_token`

```js
$('.login-dbconn').click(function () {
    auth0.login({
      connection: 'db-conn',
      username:   $('.username').val(),
      password:   $('.password').val(),
      scope: 'openid offline_access'
    },
    function (err, result) {
      // store in cookies
      // result.refreshToken is sent because offline_access is set as a scope
    });
  });
```

## Logout

After a user logs in, a JSON Web Token (JWT) is returned and this token can be saved in a cookie or in browser storage for later use. In addition to this, an SSO cookie gets set in the user's browser (unless specifying `sso: false`).

If you would like to log the user out from their current browser session in your app, provide a method for removing their JWT from the browser.

```js
  $('.logout-dbconn').click(function() {
    // local storage example
    localStorage.removeItem('id_token');
  });
```

If you would like to invalidate the user's Auth0 SSO session, use the `logout` method from `auth0.js`.

```js
  $('.logout-dbconn').click(function() {
    auth0.logout();
  });
```

This method will redirect the user to an Auth0-hosted page that says "OK". You may pass a `returnTo` value to specify where the user should be redirected to after logout.

```js
  $('.logout-dbconn').click(function() {
    auth0.logout({ returnTo: 'http://localhost:3000' }, { version: 'v2' });
  });
```

You must whitelist the **Logout URL** for your app at either the account level or the app level. To whitelist a logout URL for your entire account, provide it in your [advanced settings](https://manage.auth0.com/#/account/advanced). To whitelist for the application only, provide the logout URL in your [application settings](https://manage.auth0.com/#/clients).

If you whitelist the logout URL at the application level, pass the `client_id` for your app in the query object.

```js
  $('.logout-dbconn').click(function() {
    auth0.logout({ returnTo: 'http://localhost:3000', client_id: AUTH0_CLIENT_ID }, { version: 'v2' });
  });
```

For more information about logout, see the [documentation](https://auth0.com/docs/logout).

## Passwordless Authentication

Passwordless authentication allows users to log in by receiving a one-time password via email or text message.

#### With Email

Once you have configured a passwordless `email` connection, you can request a link or a code to be sent via email that will allow the receiver to sign in to your application.


##### Link

```js
$('.request-email-link').click(function (ev) {
  ev.preventDefault();

  auth0.requestMagicLink({
    email: $('.email-input').val()
  }, function (err) {
    if (err) {
      alert(err.error_description);
      return;
    }
    // the request was successful and you should receive
    // an email with the link at the specified address
  });
});
```

##### Code

```js
$('.request-email-code').click(function (ev) {
  ev.preventDefault();

  auth0.requestEmailCode({
    email: $('.email-input').val()
  }, function (err) {
    if (err) {
      alert(err.error_description);
      return;
    }
    // the request was successful and you should receive
    // an email with the code at the specified address
  });
});
```

Once you receive the code you can call `verifyEmailCode` to authenticate the user using an `email` and a `code`.

```js
auth0.verifyEmailCode({
  email: $('.email-input').val(),
  code: $('.email-code-input').val()
}, function (err, result) {
  if (err) {
    alert("something went wrong: " + err.error_description);
    return;
  }
  alert('Hello');
});
```

If you provide a `callbackURL` parameter when constructing the Auth0 instance, a redirect will be performed and the callback will only be invoked in the case of an error (notice it takes a single argument).

```js
auth0.verifyEmailCode({
  email: $('.email-input').val(),
  code: $('.email-code-input').val()
}, function (err) {
  if (err) {
    alert("something went wrong: " + err.error_description);
    return;
  }
});
```

#### With SMS

First you must activate and configure your passwordless [Twilio](https://twilio.com) connection in our [dashboard](https://manage.auth0.com/#/connections/passwordless).

After that you can request a passcode to be sent via SMS to a phone number. Ensure the phone number has the proper [full-length format](https://www.twilio.com/help/faq/phone-numbers/how-do-i-format-phone-numbers-to-work-internationally).


```js
$('.request-sms-code').click(function (ev) {
  ev.preventDefault();

  auth0.requestSMSCode({
    phoneNumber: $('.phone-input').val()
  }, function (err) {
    if (err) {
      alert(err.error_description);
      return;
    }
    // the request was successful and you should receive
    // a SMS with the code at the specified phone number
  });
});
```

Once you receive the code you can call `verifySMSCode` to authenticate the user using an `phoneNumber` and a `code`.

```js
auth0.verifySMSCode({
  phoneNumber: $('.phone-input').val(),
  code: $('.sms-code-input').val()
}, function (err, result) {
  if (err) {
    alert("something went wrong: " + err.error_description);
    return;
  }
  alert("Hello");
});
```

If you provide a `callbackURL` parameter when constructing the Auth0 instance, a redirect will be performed and the callback will only be invoked in the case of an error (notice it takes a single argument).

```js
auth0.verifySMSCode({
  phoneNumber: $('.phone-input').val(),
  code: $('.sms-code-input').val()
}, function (err) {
  if (err) {
    alert("something went wrong: " + err.error_description);
    return;
  }
});
```

### User Profile

The `getProfile` method allows you to obtain the user information after a successful login.

```js
auth0.getProfile(idToken, function (err, profile) {
  if(err) {
    // handle error
    return;
  }

  alert('hello ' + profile.name);
});
```


How do you get hold of the `idToken` depends on the mode you are using to log in. See below for examples for [redirect](#single-page-apps) and [popup](#popup-mode) modes.

### Processing the Callback

How does control return back to your app after a login has been attempted?  This all depends on which login "mode" you choose to use (**Redirect** or **Popup**) and in some cases, which type of connection you're using.

#### Redirect Mode

The default mode of the `login` method is Redirect Mode.  Here two separate "redirect" actions will occur when `login` is called.  First, the browser will navigate to a separate login page to collect the user's credentials.  Once the user successfully logs in, the browser will redirect the user *back* to your application via the `callbackURL`.

For example, let's say you've initialized your Auth0 client as shown in the [Initialize](#initialize) section above.  Then the following call to `login` using your `google-oauth2` social connection would result in a redirect to a Google login page and then a redirect back to `http://my-app.com/callback` if successful:

```js
auth0.login({
  connection: 'google-oauth2'
});
```

##### Single Page Apps

If you're building a SPA (Single Page Application) and using Redirect Mode, then your `callbackURL` should send the user back to the same page.  And because the `responseType` initialization option was set to `'token'`, Auth0 will also append a hash to that URL that will contain an `access_token` and `id_token` (the JWT).  After control returns to your app, the full user profile can be retrieved via the `parseHash` and `getProfile` methods:

```js
$(function () {
  var result = auth0.parseHash(window.location.hash);

  //use result.idToken to call your rest api

  if (result && result.idToken) {
    // optionally fetch user profile
    auth0.getProfile(result.idToken, function (err, profile) {
      alert('hello ' + profile.name);
    });

    // If offline_access was a requested scope
    // You can grab the result.refresh_token here

  } else if (result && result.error) {
    alert('error: ' + result.error);
  }
});
```

If the `scope` option used with the `login` method did not contain `openid profile`, then the profile will only contain `user_id`.  In that case just parse the hash to obtain the user ID:

```js
$(function () {
    var result = auth0.parseHash(window.location.hash);
    if (result && result.profile) {
      alert('your user_id is: ' + result.profile.sub);
      //use result.id_token to call your rest api
    }
  });
});
```

If there is no hash, `result` will be null.  If the hash contains the JWT, the `profile` field will be populated.

##### Regular Web Apps

If you're building a regular web application (HTML pages rendered on the server), then `callbackURL` should point to a server-side endpoint that will process the successful login, primarily to set some sort of session cookie.  In this scenario you should make sure the `responseType` option is `'code'` (or just not specified) when the Auth0 client is created:

```js
var auth0 = new Auth0({
  domain:       'mine.auth0.com',
  clientID:     'dsa7d77dsa7d7',
  callbackURL:  'http://my-app.com/callback'
  // responseType not set (defaults to 'code')
});
```

On successful login, Auth0 will redirect to your `callbackURL` with an appended authorization `code` query parameter.  Unlike the SPA scenario, this `code` value should get processed completely server-side.

> Note: Server-side processing of the `code` looks something like this: Using whichever [Auth0 server-side SDK](https://auth0.com/docs/quickstart/webapp) necessary, the endpoint on the server should exchange the `code` for an `access_token` and `id_token` and optionally a full user profile.  It should then set some kind of local session cookie, which is what enables a user to be "logged in" to the website and usually contains data from the user profile.  It should finally redirect the user back to a meaningful page.

#### Popup Mode

Besides Redirect Mode, the `login` method also supports Popup Mode, which you enable by passing `popup: true` in the `options` argument.  In this mode the browser will *not* be redirected to a separate login page.  Instead Auth0 will display a popup window where the user enters their credentials.  The advantage of this approach is that the original page (and all of its state) remains intact, which can be important, especially for certain Single Page Apps.

> **WARNING**: While Popup Mode does have the advantage of preserving page state, it has some issues. Often times users have popup blockers that prevent the login page from even displaying. There are also known issues with mobile browsers. For example, in recent versions of Chrome on iOS, the login popup does not get closed properly after login (see an example [here](https://github.com/auth0/lock/issues/71)). For these reasons, we encourage developers to favor Redirect Mode over Popup Mode, even with Single Page Apps.

In Popup Mode you also have no need to be redirected back to the application, since, once the user has logged in, the popup is simply closed.  Instead Auth0 uses the `login` method's `callback` argument to return control to your client-side application, for both failed and successful logins.  Along with the `err` argument, `callback` should also receive a `result` argument with the following properties: `idTokenPayload, idToken, accessToken, state` (and optionally `refreshToken` if the `offline_access` scope has been requested):

```js
auth0.login({
  popup: true,
  connection: 'google-oauth2'
},
function(err, result) {
  if (err) {
    // Handle the error!
    return;
  }

  // Success!

  // optionally fetch user profile
  auth0.getProfile(result.idToken, function (err, profile) {
    alert('hello ' + profile.name);
  });
});
```

#### Database and Active Directory/LDAP connections

The behavior of Redirect and Popup Modes differs if you're using a [Database](https://auth0.com/docs/connections/database/mysql) or [Active Directory/LDAP](https://auth0.com/docs/connections/enterprise/active-directory) connection.  Those differences depend on two factors: whether SSO ([Single Sign-On](https://auth0.com/docs/sso/single-sign-on)) is enabled and whether or not credentials are being directly passed to the `login` method.

##### SSO enabled

By default SSO is enabled (equivalent to passing the `sso: true` option to the `login` method).  This means that after a successful login, Auth0 will set a special cookie that [can be used](#sso) to automatically log a user onto additional websites that are registered as Auth0 apps.  When using either the Database or Active Directory/LDAP connections with SSO enabled, you can still choose to go with Redirect or Popup Mode.

As with other connection types, Redirect Mode will happen by default.  The browser will navigate to a login page that will prompt the user for their credentials and then, when login is complete, redirect back to the `callbackURL`.  However, one of the unique options you have with Database and Active Directory/LDAP connections is that the redirect to the login page can be bypassed if the `username` and `password` options are passed to the `login` method.  These values are typically collected via a *custom login form* in your app:

```js
auth0.login({
  connection: 'db-conn',
  username:   $('.username').val(),
  password:   $('.password').val(),
},
function (err) {
  // this only gets called if there was a login error
});
```

If the login is successful, the browser will then be redirected to `callbackURL`.  And as shown above a `callback` argument should also be provided to the `login` method that handles any authentication errors (without redirecting).

Furthermore, sometimes you don't want a redirect to occur at all after a login.  This is often the case with Single Page Apps where a redirect will result in loss of important page state.  To handle all login results client-side, simply provide additional parameters to the `callback` argument JavaScript function:

```js
auth0.login({
  connection: 'db-conn',
  username:   $('.username').val(),
  password:   $('.password').val(),
},
function(err, result) {
  if (err) {
    // Handle the error!
    return;
  }

  // Success!
});
```

> Note: This `callback` approach is similar to what you'd do in the [Popup Mode](#popup-mode) scenario described earlier, except no popups (or redirects) occur since credentials are provided to the `login` method and success and failure is handled in the `callback` argument.

You can still do Popup Mode with SSO enabled with a Database or Active Directory/LDAP connection if you want to (but please see the **WARNING** in the [Popup Mode](#popup-mode) section above). This is similar to the Redirect Mode scenario where you don't have a custom login form, but want to use a popup window to collect the user's credentials, and also want control to return to the client-side code (vs. redirecting to `callbackURL`).  This behavior would occur if you simply specified the `popup: true` option:

```js
auth0.login({
  connection: 'db-conn',
  popup: true
},
function(err, result) {
  if (err) {
    // Handle the error!
    return;
  }

  // Success!
});
```

##### SSO disabled

If you explicitly don't want SSO enabled in your application, you can pass the `sso: false` option to the `login` method.  The result is that when a login occurs, Auth0 performs a CORS POST request (or in IE8 or 9 a JSONP request) against a special "resource owner" endpoint (`/ro`), which allows users to authenticate by sending their username and password.  Also, no SSO cookie is set.

There are a couple important constraints at play when SSO is disabled:

* Because the `/ro` endpoint requires credentials, the `username` and `password` options must be passed to the `login` method
* It's not possible to use Popup Mode when SSO is disabled, even if you pass `popup: true`

This leaves you with a call to the `login` method that looks something like this:

```js
auth0.login({
  connection: 'db-conn',
  sso: false,
  username:   $('.username').val(),
  password:   $('.password').val()
},
function(err) {
  // this only gets called if there was a login error
});
```

If the login succeeds, Auth0 will redirect to your `callbackURL` and if it fails, control will be given to the `callback`.

And if you don't want that redirect to occur (i.e. you have a Single Page App), you can use a `callback` argument that takes the additional parameters (like what's shown in [Popup Mode](#popup-mode)), and control will go to your callback function with a failed or successful login.

### Response configuration

By default, after a successful login, the browser is redirected back to the `callbackURL` with an authorization `code` included in the `query` string. This `code` is then used by a server to obtain an access token. The access token can be obtained directly if you provide the `responseType: 'token'` option. In this case the access token will be included in the fragment (or hash) part of the `callbackURL`. Finally, you can specify `responseType: 'id_token'` if you just need an `id_token`.

```js
var auth0 = new Auth0({
  domain:       'mine.auth0.com',
  clientID:     'dsa7d77dsa7d7',
  callbackURL:  'http://my-app.com/callback',
  responseType: 'token' // also 'id_token' and 'code' (default)
});
```

Besides being included in the url, the code or the tokens can be encoded as HTML form and transmitted via an HTTP POST request to the `callbackUrl`. The `responseMode: 'form_post'` option needs to be used to activate this flow.

```js
var auth0 = new Auth0({
  domain:       'mine.auth0.com',
  clientID:     'dsa7d77dsa7d7',
  callbackURL:  'http://my-app.com/callback',
  responseMode: 'form_post',
  responseType: 'token' // also 'id_token' and 'code' (default)
});
```

Both `responseType` and `responseMode` options were added in version `7.2.0`. In previous versions, a subset of the functionality of this options was available through `callbackOnLocationHash`. `responseType: 'code'` is equivalent to `callbackOnLocationHash: false` and `responseType: 'token'` is equivalent to `callbackOnLocationHash: true`. The `callbackOnLocationHash` option is still available for compatibility reasons, but it has been deprecated and will be removed in version `8.0.0`. Also note that is not possible to use `callbackOnLocationHash` and `responseType` at the same time.

```js
// The next two snippets are equivalent, and a code will be included in the
// callbackURL after a successful login
var auth0 = new Auth0({
  // ...
  responseType: 'code'
});

var auth0 = new Auth0({
  // ...
  callbackOnLocationHash: false
});

// The next two snippets are equivalent, and a token will be included in the
// callbackURL after a successful login
var auth0 = new Auth0({
  // ...
  responseType: 'token'
});

var auth0 = new Auth0({
  // ...
  callbackOnLocationHash: true
});
```

### Change Password (database connections):

```js
  $('.change_password').click(function () {
    auth0.changePassword({
      connection: 'db-conn',
      email:   'foo@bar.com'
    }, function (err, resp) {
      if(err){
        console.log(err.message);
      }else{
        console.log(resp);
      }

    });
  });
```

This request will always return a 200, even if the user doesn't exist.
The user will receive an email with a link to reset their password.

### Delegation Token Request

A delegation token is a new token for a different service or app/API.

If you just want to get a new token for an addon that you've activated, you can do the following:

```js
var options = {
  id_token: "your id token", // The id_token you have now
  api: 'firebase', // This defaults to the first active addon if any or you can specify this
  "scope": "openid profile"         // default: openid
};

auth0.getDelegationToken(options, function (err, delegationResult) {
    // Call your API using delegationResult.id_token
});
```

If you want to get the token for another API or App:

```js
var options = {
  id_token: "your id token", // The id_token you have now
  api: 'auth0' // This is default when calling another app that doesn't have an addon
  targetClientId: 'The other client id'
};

auth0.getDelegationToken(options, function (err, delegationResult) {
  // Call your API using delegationResult.id_token
});
```

### Refresh token

> This methods will be deprecated soon. Use `silentAuthentication` instead

If you want to refresh your existing (not expired) token, you can just do the following:

```js
auth0.renewIdToken(current_id_token, function (err, delegationResult) {
  // Get here the new delegationResult.id_token
});
```

If you want to refresh your existing (expired) token, if you have the refresh_token, you can call the following:

```js
auth0.refreshToken(refresh_token, function (err, delegationResult) {
  // Get here the new delegationResult.id_token
});
```

### Silent Authentication		

> Note: This only works when `OAuth 2.0 API Authorization` is enabled in the advanced accounts settings in the [Auth0 Dashboard](https://manage.auth0.com/#/account/advanced). For social connections, using your own app keys is mandatory.		
	
If you want to fetch a new token because your existing token is expired (or soon to expire), you can fetch a new one doing the following:		

```js		
auth0.silentAuthentication({}, function(err, result){		
  // Get here the new result.id_token		
})		
```		

This by default will use the callback url defined in the constructor. If this callback url is the same that handle the regular authentication callback, you will need to have in mind that you will need to handle the case where the user is already loged in and reached that path again.		
		
If you want to use a different one, you can send the new `callbackURL` in the options param:		
	
```js		
auth0.silentAuthentication({		
   callbackURL: "https://.../silentCallback"		
 }, function(err, result){		
 // Get here the new result.id_token		
})		
```		
		
There are two ways this method works. The default behaviour will try to parse the callback url hash, but it also support `postMessage` to send the authentication result from the callback page back to the sdk. 		
		
```js		
auth0.silentAuthentication({		
    usePostMessage:true, 		
    callbackURL: "https://.../silentCallback"		
  }, function(err, result){		
  // Get here the new result.id_token		
})		
```		

An example of the callback page is the following:		

```html		
<!DOCTYPE html>		
<html>		
  <head>		
    <script src="/auth0.js"></script>		
    <script type="text/javascript">		
        var auth0 = new Auth0({		
          domain:       'mine.auth0.com',		
          clientID:     '...'		
        });		
        var result = auth0.parseHash(window.location.hash);		
        if (result) {		
          parent.postMessage(result, "https://.../"); //The second parameter should be your domain		
        }		
    </script>		
  </head>		
  <body></body>		
</html>		
```

### Validate User

You can validate a user of a specific connection with his username and password:

```js
auth0.validateUser({
  connection:   'db-conn',
  username:     'foo@bar.com',
  password:     'blabla'
}, function (err, valid) { });
```

### SSO

Method `getSSOData` fetches Single Sign-On information:

```js
  auth0.getSSOData(function (err, ssoData) {
    if (err) return console.log(err.message);
    expect(ssoData.sso).to.exist;
  });
```

The returned `ssoData` object will contain the following fields, for example:

```js
{
  sso: true,
  sessionClients: [
    "jGMow0KO3WDJELW8XIxolqb1XIitjkYL"
  ],
  lastUsedClientID: "jGMow0KO3WDJELW8XIxolqb1XIitjkYL",
  lastUsedUsername: "alice@example.com",
  lastUsedConnection: {
    name: "Username-Password-Authentication",
    strategy: "auth0"
  }
}
```

Load Active Directory data if available (Kerberos):

```js
  auth0.getSSOData(true, fn);
```

When Kerberos is available you can automatically trigger Windows Authentication. As a result the user will immediately be authenticated without taking any action.

```js
  auth0.getSSOData(true, function (err, ssoData) {
    if (!err && ssoData && ssoData.connection) {
      auth0.login({ connection: ssoData.connection });
    }
  });
```

## Develop

Run `grunt dev` and point your browser to `http://localhost:9999/test_harness.html` to run the test suite.

Run `grunt phantom` if you have PhantomJS installed.

Run `grunt integration` (or `npm test`) if you have SauceLabs account. You will need a `SAUCE_ACCESS_KEY` and `SAUCE_USERNAME` env variables.

## Publishing a new version

Use:

```
$ ./bin/version patch
$ git push origin master
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.

<!-- Vaaaaarrrrsss -->

[npm-image]: https://img.shields.io/npm/v/auth0-js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/auth0-js
[travis-image]: https://travis-ci.org/auth0/auth0.js.svg?branch=master
[travis-url]: https://travis-ci.org/auth0/auth0.js
[coveralls-image]: https://img.shields.io/coveralls/auth0/auth0.js.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/auth0/auth0.js?branch=master
[david-image]: http://img.shields.io/david/auth0/auth0.js.svg?style=flat-square
[david-url]: https://david-dm.org/auth0/auth0.js
[license-image]: http://img.shields.io/npm/l/auth0-js.svg?style=flat-square
[license-url]: #license
[downloads-image]: http://img.shields.io/npm/dm/auth0-js.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/auth0-js
