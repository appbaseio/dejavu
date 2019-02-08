/* eslint-disable */
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.browserAction.setPopup({
		popup: 'popup.html',
	});
});

chrome.runtime.setUninstallURL('https://siddharth31.typeform.com/to/Z8AUHk');
