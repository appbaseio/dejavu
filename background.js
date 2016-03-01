chrome.app.runtime.onLaunched.addListener(
    function () {
        //chrome.app.window.create('site/index.html');
        chrome.system.display.getInfo(function(info) {
	    var width = info[0].workArea.width;
	    var height = info[0].workArea.height;
	    chrome.app.window.create('site/index.html', {
	        bounds: {
	            width: width,
	            height: height
	        },
	    });
	});
    }
);