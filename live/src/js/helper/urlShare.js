var secret = 'dejvu';
var decryptedData = {};
var dejavuUrl;
var queryParams;

initialize();

// Encrypt
function createUrl(inputs, cb) {
	compress(inputs, compressCb.bind(this));

	function compressCb(error, ciphertext) {
		const allowParams = ['hf', 'h', 'f', 'query', 'sidebar', 'type', 'subscribe', 'importer', 'editable'];
		if (!error) {
			dejavuUrl = ciphertext;
			let finalUrl = '';
			if (window.location.href.indexOf('?default=true') > -1) {
				finalUrl = window.location.href.split('?default=true')[0];
				storageService.set('esurl', inputs.url);
				storageService.set('appname', inputs.appname);
			}
			finalUrl += '#?input_state=' + dejavuUrl;
			for(var param in queryParams) {
				if(queryParams.hasOwnProperty(param) && allowParams.indexOf(param) > -1) {
					finalUrl += '&'+param+'='+queryParams[param];
				}
			}
			mirageLink(function() {});
			window.location.href = finalUrl;
		}
		if (cb) {
			cb(error, ciphertext);
		}
	}
}

// Decrypt
function getUrl(cb) {
	var url = window.location.href.split('#?input_state=');
	queryParams = getQueryParameters();
	if (queryParams && queryParams.input_state) {
		decompress(queryParams.input_state, function(error, data) {
			if (data) {
				applyDecrypt(data);
				cb(decryptedData);
			}
		});
	} else if(queryParams && queryParams.app) {
		try {
			data = JSON.parse(queryParams.app);
			decryptedData = data;
			applyDecrypt(data);
			cb(data);
		} catch(e) {
			console.log(e);
		}
	}

	function applyDecrypt(decryptedData) {
		window.storageService.setItem('esurl', decryptedData.url);
		window.storageService.setItem('appname', decryptedData.appname);
		var types;
		try {
			types = JSON.stringify(decryptedData.selectedType);
		} catch (e) {
			types = JSON.stringify([]);
		}
		types = types == null ? [] : types;
		window.storageService.setItem('types', types);
	}
}

// convertToUrl
function convertToUrl(type) {
	const ciphertext = dejavuUrl;
	let finalUrl = '';
	if (type === 'gh-pages') {
		finalUrl = 'appbaseio.github.io/dejavu/live/#?input_state=' + ciphertext;
	} else if (type === 'appbaseio') {
		finalUrl = 'https://appbase.io/scalr/' + input_state.appname + '/browser/#?input_state=' + ciphertext;
	} else {
		finalUrl = window.location.protocol + '//' + window.location.host + '#?input_state=' + ciphertext;
	}
	if (getQueryParameters().editable) {
		finalUrl += `&editable=${getQueryParameters().editable}`;
	}
	return finalUrl;
}

function mirageLink(cb) {
	var obj = {};
	if (input_state) {
		input_state.selectedType = input_state.selectedType ? input_state.selectedType : [];
		obj = {
			config: {
				url: input_state.url,
				appname: input_state.appname
			},
			selectedTypes: input_state.selectedType
		};
	}
	var data = JSON.stringify(obj);
	compress(obj, compressCb.bind(this));

	function compressCb(error, ciphertext) {
		if (!error) {
			var final_url = 'https://appbaseio.github.io/mirage/#?input_state=' + ciphertext;
			$('.mirage_link').attr('href', final_url);
			return cb(null, final_url);
		} else {
			return cb(error);
		}
	}
}

function compress(jsonInput, cb) {
	if (!jsonInput) {
		return cb('Input should not be empty');
	} else {
		var packed = JSON.stringify(jsonInput);
		JSONURL.compress(packed, 9, function(res, error) {
			try {
				var result = SafeEncode.buffer(res);
				cb(null, SafeEncode.encode(result));
			} catch (e) {
				cb(e);
			}
		});
	}
}

function decompress(compressed, cb) {
	var self = this;
	if (compressed) {
		var compressBuffer = SafeEncode.buffer(compressed);
		JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
			var decryptedData = res;
			try {
				if (decryptedData) {
					decryptedData = JSON.parse(decryptedData);
					self.decryptedData = decryptedData;
					cb(null, decryptedData);
				} else {
					cb('Not found');
				}
			} catch (e) {
				cb(e);
			}
		});
	} else {
		return cb('Empty');
	}
}

function getQueryParameters(str) {
	var tempurl = decodeURIComponent(window.location.href);
	let hash = tempurl.split('#');
	if (hash.length > 1) {
		return (str || hash[1]).replace(/(^\?)/, '').split("&").map(function(n) {
			return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
	} else {
		return null;
	}
}

function setQueryParamerter(param, value) {
	const currentUrl = decodeURIComponent(window.location.href);
	let nextUrl = currentUrl;
	const currentParam = getQueryParameters(currentUrl)[param];
	if (currentParam === undefined) {
		nextUrl = `${nextUrl}&${param}=${value}`;
	} else {
		const initialIndex = currentUrl.indexOf(`&${param}=`);
		const finalIndex = currentUrl.indexOf('&', initialIndex + 1);
		nextUrl = `${currentUrl.substring(0, initialIndex)}&${param}=${value}`;
		if (finalIndex !== -1) {
			nextUrl = `${nextUrl}${currentUrl.substring(finalIndex)}`;
		}
	}
	window.location.href = nextUrl;
}

function initialize() {
	var dejavuHash = localStorage.getItem("dejavuHash");
	if(dejavuHash) {
		localStorage.removeItem("dejavuHash");
		window.location.href = window.location.protocol+"//"+window.location.host+window.location.pathname+dejavuHash;
	}
}
