function StorageService() {
	this.setItem = function(key, value) {
		if(BRANCH === 'chrome') {
			var obj = {};
			obj[key] = value;
			return chrome.storage.local.set(obj);
		} else {
			window.localStorage.setItem(key, value);
		}
	};
	this.getItem = function(key, cb) {
		if(BRANCH === 'chrome') {
			if(!cb) {
				return chrome.storage.local.get(key, function() {});
			} else {
				return chrome.storage.local.get(key, cb);
			}
		} else {
			return window.localStorage.getItem(key);
		}
	};	
	this.set = function(key, value) {
		window.localStorage.setItem(key, value);
	}
	this.get = function(key) {
		return window.localStorage.getItem(key);
	}
}
var storageService = new StorageService();