const EventEmitter = require("fbemitter").EventEmitter;

const authEmitter = new EventEmitter();

const AuthOperation = function () {
	const authConfig = {
		domain: "appbaseio.auth0.com",
		clientID: "tCy6GxnrsyKec3UxXCuYLhU6XWFCMgRD",
		callbackURL: location.href,
		callbackOnLocationHash: true
	};
	this.serverAddress = "https://ossauth.appbase.io";
	this.auth0 = new Auth0(authConfig);
	// check if already logged in
	if (BRANCH !== "master") {
		this.init();
	}
};

AuthOperation.prototype.init = function () {
	const self = this;
	this.parseHash.call(this);
	const parseHash = this.parseHash.bind(this);
	setTimeout(() => {
		console.log("hash watching Activated!");
		window.onhashchange = function () {
			if (!self.access_token_applied && location.hash.indexOf("access_token") > -1) {
				console.log("access_token found!");
				parseHash();
			}
		};
	}, 300);
};
AuthOperation.prototype.isTokenExpired = function (token) {
	const decoded = this.auth0.decodeJwt(token);
	const now = (new Date()).getTime() / 1000;
	return decoded.exp < now;
};
AuthOperation.prototype.login = function (subscribeOption) {
	const savedState = window.location.hash;
	storageService.set("subscribeOption", subscribeOption);
	if (savedState.indexOf("access_token") < 0) {
		storageService.set("savedState", savedState);
	}
	this.auth0.login({
		connection: "github"
	}, (err) => {
		if (err) console.log(`something went wrong: ${err.message}`);
	});
};
AuthOperation.prototype.show_logged_in = function (token) {
	this.token = token;
	if (window.location.hash.indexOf("access_token") > -1) {
		this.restoreStates();
	} else {
		this.getUserProfile();
	}
};
AuthOperation.prototype.restoreStates = function () {
	const domain = location.href.split("#")[0];
	const savedState = storageService.get("savedState");
	let finalPath = domain;
	if (savedState && savedState.indexOf("access_token") < 0) {
		finalPath += savedState;
	} else {
		finalPath += "#";
	}
	window.location.href = finalPath;
	location.reload();
};
AuthOperation.prototype.getUserProfile = function () {
	const url = `${this.serverAddress}/api/getUserProfile`;
	const subscribeOption = storageService.get("subscribeOption") && storageService.get("subscribeOption") !== "null" ? storageService.get("subscribeOption") : null;
	const request = {
		token: storageService.get("dejavu_id_token"),
		origin_app: "DEJAVU",
		email_preference: subscribeOption
	};
	$.ajax({
		type: "POST",
		url,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify(request)
	})
		.done((res) => {
			storageService.set("subscribeOption", null);
			authEmitter.emit("profile", res.message);
		})
		.fail((err) => {
			console.error(err);
		});
};
AuthOperation.prototype.parseHash = function () {
	const token = storageService.get("dejavu_id_token");
	if (token !== null && !this.isTokenExpired(token)) {
		this.show_logged_in(token);
	} else {
		const result = this.auth0.parseHash(window.location.hash);
		if (result && result.idToken) {
			storageService.set("dejavu_id_token", result.idToken);
			this.show_logged_in(result.idToken);
		} else if (result && result.error) {
			console.log(`error: ${result.error}`);
			this.show_sign_in();
		} else {}
	}
};

const authOperation = new AuthOperation();

module.exports = {
	authEmitter,
	authOperation
};
