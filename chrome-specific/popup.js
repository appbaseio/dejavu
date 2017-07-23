chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.create({
    	url: 'live/index.html'
  	});
});