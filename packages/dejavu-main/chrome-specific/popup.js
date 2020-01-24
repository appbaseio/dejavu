/* eslint-disable */
chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.create({
		url: 'index.html',
	});
});
