chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.create({
    	url: 'site/index.html'
  	});
});