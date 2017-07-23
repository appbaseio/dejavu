const secret = "dejvu";
const decryptedData = {};
let dejavuUrl;
let queryParams;

initialize();

// Encrypt
function createUrl(inputs, cb) {
	compress(inputs, compressCb.bind(this));

	function compressCb(error, ciphertext) {
		const allowParams = ["hf", "h", "f", "query", "sidebar", "type", "subscribe", "importer"];
		if (!error) {
			dejavuUrl = ciphertext;
			let finalUrl = "";
			if (window.location.href.indexOf("?default=true") > -1) {
				finalUrl = window.location.href.split("?default=true")[0];
				storageService.set("esurl", inputs.url);
				storageService.set("appname", inputs.appname);
			}
			finalUrl += `#?input_state=${dejavuUrl}`;
			for (const param in queryParams) {
				if (queryParams.hasOwnProperty(param) && allowParams.indexOf(param) > -1) {
					finalUrl += `&${param}=${queryParams[param]}`;
				}
			}
			mirageLink(() => {});
			window.location.href = finalUrl;
		}
		if (cb) {
			cb(error, ciphertext);
		}
	}
}

// Decrypt
function getUrl(cb) {
	const url = window.location.href.split("#?input_state=");
	queryParams = getQueryParameters();
	if (queryParams && queryParams.input_state) {
		decompress(queryParams.input_state, (error, data) => {
			if (data) {
				applyDecrypt(data);
				cb(decryptedData);
			}
		});
	}

	function applyDecrypt(decryptedData) {
		window.storageService.setItem("esurl", decryptedData.url);
		window.storageService.setItem("appname", decryptedData.appname);
		let types;
		try {
			types = JSON.stringify(decryptedData.selectedType);
		} catch (e) {
			types = JSON.stringify([]);
		}
		types = types == null ? [] : types;
		window.storageService.setItem("types", types);
	}
}

// convertToUrl
function convertToUrl(type) {
	const ciphertext = dejavuUrl;
	let final_url = "";
	if (type == "gh-pages") {
		final_url = `appbaseio.github.io/dejavu/live/#?input_state=${ciphertext}`;
	} else if (type == "appbaseio") {
		final_url = `https://appbase.io/scalr/${input_state.appname}/browser/#?input_state=${ciphertext}`;
	} else {
		final_url = `${window.location.protocol}//${window.location.host}#?input_state=${ciphertext}`;
	}
	return final_url;
}

function mirageLink(cb) {
	let obj = {};
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
	const data = JSON.stringify(obj);
	compress(obj, compressCb.bind(this));

	function compressCb(error, ciphertext) {
		if (!error) {
			const final_url = `https://appbaseio.github.io/mirage/#?input_state=${ciphertext}`;
			$(".mirage_link").attr("href", final_url);
			return cb(null, final_url);
		}
		return cb(error);
	}
}

function compress(jsonInput, cb) {
	if (!jsonInput) {
		return cb("Input should not be empty");
	}
	const packed = JSON.stringify(jsonInput);
	JSONURL.compress(packed, 9, (res, error) => {
		try {
			const result = SafeEncode.buffer(res);
			cb(null, SafeEncode.encode(result));
		} catch (e) {
			cb(e);
		}
	});
}

function decompress(compressed, cb) {
	const self = this;
	if (compressed) {
		const compressBuffer = SafeEncode.buffer(compressed);
		JSONURL.decompress(SafeEncode.decode(compressBuffer), (res, error) => {
			let decryptedData = res;
			try {
				if (decryptedData) {
					decryptedData = JSON.parse(decryptedData);
					self.decryptedData = decryptedData;
					cb(null, decryptedData);
				} else {
					cb("Not found");
				}
			} catch (e) {
				cb(e);
			}
		});
	} else {
		return cb("Empty");
	}
}

function getQueryParameters(str) {
	const hash = window.location.hash.split("#");
	if (hash.length > 1) {
		return (str || hash[1]).replace(/(^\?)/, "").split("&").map(function (n) {
			return n = n.split("="), this[n[0]] = n[1], this;
		}.bind({}))[0];
	}
	return null;
}

function initialize() {
	const dejavuHash = localStorage.getItem("dejavuHash");
	if (dejavuHash) {
		localStorage.removeItem("dejavuHash");
		window.location.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}${dejavuHash}`;
	}
}
