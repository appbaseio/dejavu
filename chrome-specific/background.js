/* eslint-disable */
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.browserAction.setPopup({
		popup: 'popup.html',
	});
});
