function StorageService() {
	this.setItem = function (key, value) {
		if (BRANCH === "chrome") {
			const obj = {};
			obj[key] = value;
			return chrome.storage.local.set(obj);
		}
		window.localStorage.setItem(key, value);
	};
	this.getItem = function (key, cb) {
		if (BRANCH === "chrome") {
			if (!cb) {
				return chrome.storage.local.get(key, () => {});
			}
			return chrome.storage.local.get(key, cb);
		}
		return window.localStorage.getItem(key);
	};
	this.set = function (key, value) {
		window.localStorage.setItem(key, value);
	};
	this.get = function (key) {
		return window.localStorage.getItem(key);
	};
}
const storageService = new StorageService();
