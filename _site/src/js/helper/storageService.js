function StorageService() {
	this.setItem = function(key, value) {
		window.localStorage.setItem(key, value);
	};
	this.getItem = function(key) {
		return window.localStorage.getItem(key);	
	};	
}
var storageService = new StorageService();