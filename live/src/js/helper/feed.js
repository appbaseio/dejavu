// This file contains all the logic for your app
// authentication and streaming data from your
// endpoint.
// **Configs:** Appname and Credentials

// Get data size according to window height


function getDataSize() {
	const mininum_data_size = 20;
	const winHeight = $(window).height() - 150;
	const rowHeight = 51;
	const min_rows = Math.ceil(winHeight / rowHeight);
	const rows = min_rows < mininum_data_size ? mininum_data_size : min_rows;
	return rows;
}

const DATA_SIZE = getDataSize();
let APPNAME,
	USERNAME,
	PASSWORD,
	dejavuURL,
	OperationFlag,
	APPURL,
	input_state,
	HOST,
	streamingInterval,
	fullColumns;
let appbaseRef;
const getMapFlag = false;
const appAuth = true;
const exportJsonData = [];
let counterStream,
	streamRef;

// Instantiating appbase ref with the global configs defined above.
function init() {
	appbaseRef = new Appbase({
		url: dejavuURL,
		appname: APPNAME,
		username: USERNAME,
		password: PASSWORD
	});
}

// parse the url and detect username, password
function filterUrl(url) {
	if (url) {
		const obj = {
			username: "test",
			password: "test",
			url
		};
		const urlsplit = url.split(":");
		try {
			obj.username = urlsplit[1].replace("//", "");
			const httpPrefix = url.split("://");
			if (urlsplit[2]) {
				const pwsplit = urlsplit[2].split("@");
				obj.password = pwsplit[0];
				if (url.indexOf("@") !== -1) {
					obj.url = `${httpPrefix[0]}://${pwsplit[1]}`;
					if (urlsplit[3]) {
						obj.url += `:${urlsplit[3]}`;
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
		return obj;
	}
	return null;
}

// If default = true then take it from config.js
const browse_url = window.location.href;
const flag_url = browse_url.split("?default=")[1] === "true" || browse_url.split("?default=")[1] === true;

if (BRANCH === "dev" || BRANCH === "master" || BRANCH === "gh-pages") {
	if (!flag_url || decryptedData.hasOwnProperty("url")) {
		config = {
			url: storageService.getItem("esurl"),
			appname: storageService.getItem("appname")
		};
	}
	beforeInit();
} else if (BRANCH === "appbase") {
	parent.globalAppData((res) => {
		APPNAME = res.appname;
		USERNAME = res.username;
		PASSWORD = res.password;
		APPURL = `https://${USERNAME}:${PASSWORD}@scalr.api.appbase.io`;
		storageService.setItem("esurl", APPURL);
		storageService.setItem("appname", APPNAME);
		config = {
			url: APPURL,
			appname: APPNAME
		};
		beforeInit();
	});
} else {
	storageService.getItem("esurl", (result) => {
		config.url = result.esurl;
		$("#configUrl").val(config.url);
		storageService.getItem("appname", (result1) => {
			config.appname = result1.appname;
			$("#configAppname").val(config.appname);
			beforeInit();
		});
	});
}

function beforeInit() {
	APPNAME = config.appname;
	dejavuURL = config.url;
	if (dejavuURL) {
		const parsedUrl = filterUrl(dejavuURL);
		USERNAME = parsedUrl.username;
		PASSWORD = parsedUrl.password;
		dejavuURL = parsedUrl.url;
		HOST = parsedUrl.url;
		APPURL = `${dejavuURL}/${APPNAME}`;
		OperationFlag = false;

		// to store input state
		input_state = {
			url: config.url,
			appname: APPNAME
		};
		init();
	}
}

// vars for tracking current data and types
let sdata = {}; // data to be displayed in table
const headers = ["_type", "_id"];
let esTypes = []; // all the types in current 'app'
const subsetESTypes = []; // currently 'selected' types

const feed = (function () {
	// This function is built only to maintain the total number of records
	// It's hard to figure out correct total number of records while streaming and filtering is together
	function countStream(types, setTotal, query) {
		const defaultQuery = {
			query: {
				match_all: {}
			}
		};
		query = query || defaultQuery;
		appbaseRef.search({
			type: types,
			body: query
		}).on("data", (res) => {
			if (res && res.hits && res.hits.total) {
				setTotal(res.hits.total);
			}
		});

		// Stop old stream
		if (typeof counterStream !== "undefined") {
			counterStream.stop();
		}

		counterStream = appbaseRef.searchStream({
			type: types,
			body: query
		}).on("data", (res2) => {
			// For update data
			if (res2._updated) {
				console.log("Updated");
			} else if (res2._deleted) {
				setTotal(0, true, "delete");
			}
			// For Index data
			else {
				setTotal(0, true, "index");
			}
		}).on("error", (err) => {
			console.log("caught a stream error", err);
		});
	}

	function allowOtherOperation() {
		setTimeout(() => {
			OperationFlag = false;
		}, 500);
	}

	// ajax call instead of appbase search, to use preference in search query
	function applyAppbaseSearch(finalUrl, queryBody, cb_succes, cb_error) {
		$.ajax({
			type: "POST",
			beforeSend(request) {
				request.setRequestHeader("Authorization", `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`);
			},
			url: finalUrl,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(queryBody),
			xhrFields: {
				withCredentials: true
			},
			success(res) {
				cb_succes(res);
			},
			error() {
				$(".full_page_loading").addClass("hide");
				if (cb_error) {
					cb_error();
				}
			}
		});
	}

	// paginate and show new results when user scrolls
	// to the bottom of the existing results.
	function paginationSearch(typeName, from, callback, queryBody) {
		if (typeName !== null) {
			const defaultQueryBody = {
				query: {
					match_all: {}
				}
			};
			queryBody = queryBody || defaultQueryBody;
			const typesString = typeName.join(",");
			const finalUrl = `${HOST}/${APPNAME}/${typesString}/_search?preference=abcxyz&from=${from}&size=${DATA_SIZE}`;
			applyAppbaseSearch(finalUrl, queryBody, (res) => {
				callback(res.hits.hits);
			});
		}
	}

	// applies a searchStream() query on a particular ``type``
	// to establish a continuous query connection.
	// use applyAppbaseSearch to get the data
	function applyStreamSearch(types, callback, queryBody, setTotal, streamQuery) {
		if (types !== null) {
			const defaultQueryBody = {
				query: {
					match_all: {}
				}
			};
			queryBody = queryBody || defaultQueryBody;
			const dataSize = Object.keys(sdata).length;
			sdata = {}; // we can't reliably keep state once type info changes, hence we fetch everything again.
			let typesString = types;
			try {
				typesString = types.join(",");
			} catch (e) {
				console.log(e, types);
			}
			const finalUrl = `${HOST}/${APPNAME}/${typesString}/_search?preference=abcxyz&from=${0}&size=${Math.max(dataSize, DATA_SIZE)}`;
			applyAppbaseSearch(finalUrl, queryBody, (res) => {
				try {
					let hits,
						flag,
						total;
					if (res.hits.hits.length === 0) {
						hits = null;
						flag = false;
						total = 0;
					} else {
						hits = res.hits.hits;
						flag = false;
						total = res.hits.total;
					}
					allowOtherOperation();
					return callback(hits, flag, total);
				} catch (err) {
					allowOtherOperation();
					console.log(err);
				}
			}, () => {
				allowOtherOperation();
			});

			// Counter stream
			countStream(types, setTotal, streamQuery);

			// Stop old stream
			if (typeof streamRef !== "undefined") {
				streamRef.stop();
			}

			// get new data updates
			streamRef = appbaseRef.searchStream({
				type: types,
				body: queryBody
			}).on("data", (res) => {
				if (res.hasOwnProperty("_updated")) {
					delete res._updated;
				}
				callback(res, true);
			}).on("error", (err) => {
				console.log("caught a stream error", err);
			});
		}
	}

	return {
		countStream(types, setTotal, query) {
			countStream(types, setTotal, query);
		},
		// exposes ``applyStreamSearch()`` as ``getData()``
		getData(types, callback, setTotal) {
			applyStreamSearch(types, callback, false, setTotal);
		},
		// ``deleteData()`` deletes the data records when
		// a type is unchecked by the user.
		deleteData(typeName, callback) {
			const localSdata = {};
			for (const data in sdata) {
				if (sdata[data]._type !== typeName) {
					localSdata[data] = sdata[data];
				}
			}
			sdata = localSdata;
			callback(sdata);
		},
		// ``paginateData()`` scrolls new results using the
		// datatable's current length.
		paginateData(total, callback, queryBody, types) {
			types = types || subsetESTypes;
			paginationSearch(types, Object.keys(sdata).length, callback, (queryBody !== null) ? queryBody : null);
		},
		// gets all the types of the current app;
		getTypes(callback) {
			if (typeof APPNAME !== "undefined") {
				this.filterType().done((data) => {
					const buckets = data.aggregations.count_by_type.buckets;
					let types = buckets.filter(bucket => bucket.doc_count > 0);
					types = types.map(bucket => bucket.key);
					if (types.length) {
						if (JSON.stringify(esTypes.sort()) !== JSON.stringify(types.sort())) {
							esTypes = types.slice();
							if (callback !== null) {
								return callback(types);
							}
						}
					} else {
						esTypes = types;
						if (callback !== null) {
							return callback(types);
						}
					}
				}).error((xhr) => {
					console.log(xhr);
					clearInterval(streamingInterval);
					console.log("error in retrieving types: ", xhr);
				});
			} else {
				const $this = this;
				setTimeout(() => {
					$this.getTypes(callback);
				}, 1000);
			}
		},
		indexData(recordObject, method, callback) {
			const self = this;
			if (method === "index" || method === "bulk") {
				applyIndexOrBulk(method);
			} else {
				const doc = recordObject.body;
				recordObject.body = {
					doc
				};
				console.log(recordObject);
				appbaseRef.update(recordObject).on("data", () => {
					if (callback) {
						return callback();
					}
				});
			}

			function applyIndexOrBulk(method) {
				appbaseRef[method](recordObject).on("data", (res) => {
					if (esTypes.indexOf(recordObject.type) === -1) {
						self.getTypes((newTypes) => {
							if (callback) {
								return callback(res, newTypes);
							}
						});
					} else {
						return callback(res);
					}
				}).on("error", err => callback(err));
			}
		},
		deleteRecord(selectedRows, callback) {
			const deleteArray = selectedRows.map(v => ({ delete: v }));
			console.log(deleteArray);

			function deleteData(sdata, data) {
				selectedRows.forEach((v) => {
					if (typeof sdata[data] !== "undefined") {
						if (sdata[data]._type === v._type && sdata[data]._id === v._id) {
							delete sdata[data];
						}
					}
				});
			}

			appbaseRef.bulk({
				body: deleteArray
			}).on("data", (data) => {
				for (const record in sdata) {
					if (sdata.hasOwnProperty(record)) {
						deleteData(sdata, record);
					}
				}
				callback(sdata);
			});
		},
		getSingleDoc(type, callback) {
			appbaseRef.search({
				type,
				from: 0,
				size: 1,
				body: {
					query: {
						match_all: {}
					}
				}
			}).on("data", (data) => {
				callback(data);
			});
		},
		getMapping() {
			const createUrl = `${HOST}/${APPNAME}/_mapping`;
			return $.ajax({
				type: "GET",
				beforeSend(request) {
					request.setRequestHeader("Authorization", `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`);
				},
				url: createUrl,
				xhrFields: {
					withCredentials: true
				}
			});
		},
		applyQuery(url, queryBody) {
			return $.ajax({
				type: "POST",
				beforeSend(request) {
					request.setRequestHeader("Authorization", `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`);
				},
				url,
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(queryBody),
				xhrFields: {
					withCredentials: true
				}
			});
		},
		applyGetQuery(temp_config, ajaxType) {
			var ajaxType = ajaxType || "GET";
			return $.ajax({
				type: ajaxType,
				beforeSend(request) {
					request.setRequestHeader("Authorization", `Basic ${btoa(`${temp_config.username}:${temp_config.password}`)}`);
				},
				url: temp_config.url,
				xhrFields: {
					withCredentials: true
				}
			});
		},
		filterType() {
			const createUrl = `${HOST}/${APPNAME}/_search?search_type=query_then_fetch`;
			const queryBody = {
				size: 0,
				aggs: {
					count_by_type: {
						terms: {
							field: "_type",
							size: 1000000
						}
					}
				}
			};
			return this.applyQuery(createUrl, queryBody);
		},
		scrollapi(types, queryBody, scroll, scroll_id) {
			const typesString = types.join(",");
			const createUrl = `${HOST}/${APPNAME}/${typesString}/_search?scroll=5m`;
			const scrollUrl = `${HOST}/_search/scroll?scroll=5m&scroll_id=${scroll_id}`;
			const finalUrl = scroll ? scrollUrl : createUrl;
			return this.applyQuery(finalUrl, queryBody);
		},
		testQuery(types, queryBody) {
			// get historical data
			return appbaseRef.search({
				type: types,
				from: 0,
				size: 0,
				body: queryBody
			});
		},
		getTotalRecord() {
			// get historical data
			return appbaseRef.search({
				from: 0,
				size: 0,
				type: [],
				body: {
					query: {
						match_all: {}
					}
				}
			});
		},
		getIndices(url) {
			const temp_config = this.filterUrl(url);
			if (temp_config) {
				temp_config.url += "/_stats/indices";
				return this.applyGetQuery(temp_config);
			}
			return null;
		},
		checkIndex(url, appname) {
			return this.executeIndexOperation(url, appname);
		},
		createIndex(url, appname) {
			return this.executeIndexOperation(url, appname);
		},
		executeIndexOperation(url, appname) {
			const temp_config = this.filterUrl(url);
			if (temp_config) {
				temp_config.url += `/${appname}`;
				console.log(temp_config);
				return this.applyGetQuery(temp_config, "POST");
			}
			return null;
		},
		filterUrl(url) {
			return filterUrl(url);
		},
		externalQuery(query, typeName, callback, setTotal) {
			this.externalQueryBody = query;
			this.externalQueryType = typeName;
			applyStreamSearch(typeName, callback, this.externalQueryBody, setTotal, query);
		},
		removeExternalQuery() {
			delete this.externalQueryBody;
		},
		filterQuery(filterQuerys, typeName, callback, setTotal) {
			this.queryBody = this.generateFilterQuery(filterQuerys);
			applyStreamSearch(typeName, callback, this.queryBody, setTotal);
		},
		generateFilterQuery(filterQuerys) {
			const queries = [];
			filterQuerys.forEach((filterItem) => {
				const query = this.createFilterQuery(filterItem.method, filterItem.columnName, filterItem.value, filterItem.analyzed);
				queries.push(query);
			});
			const queryBody = {
				query: {
					bool: {
						must: queries
					}
				}
			};
			return queryBody;
		},
		// Create Filter Query by passing attributes
		createFilterQuery(method, columnName, value, analyzed) {
			let queryBody = {};
			let queryMaker = [];
			let subQuery;

			function setQuery() {
				subQuery = analyzed ? "match" : "term";
				value.forEach((val) => {
					const termObj = {};
					termObj[columnName] = val.trim();
					const obj = {};
					obj[subQuery] = termObj;
					queryMaker.push(obj);
				});
				return queryMaker;
			}

			function gtLtQuery(method) {
				termObj = {};
				termObj[columnName] = {};
				termObj[columnName][method] = value[0];
				queryBody = {
					range: termObj
				};
				return termObj;
			}

			function createHasQuery(queryMaker) {
				const boolQuery = {
					minimum_should_match: 1
				};
				const boolType = method === "has" ? "must" : "must_not";
				boolQuery[boolType] = queryMaker;
				return {
					bool: boolQuery
				};
			}

			switch (method) {
				case "has":
				case "has not":
					// If field is analyzed use MATCH else term
					queryMaker = setQuery();
					queryBody = createHasQuery(queryMaker);
					break;

				case "search":
					var termObj = {};
					termObj[columnName] = value[0].trim();
					queryBody = {
						match: termObj
					};
					break;

				case "greater than":
					termObj = gtLtQuery("gte");
					break;

				case "less than":
					termObj = gtLtQuery("lte");
					break;

				case "range":
					var rangeVal = value[0].split("@");
					termObj = {};
					termObj[columnName] = {};
					termObj[columnName] = {
						gte: rangeVal[0],
						lte: rangeVal[1]
					};
					queryBody = {
						range: termObj
					};
					break;

				case "term":
					termObj = {};
					termObj[columnName] = value[0].trim();
					queryBody = {
						term: termObj
					};
					break;
			}
			return queryBody;
		},
		b64toBlob(b64Data, contentType, sliceSize) {
			contentType = contentType || "";
			sliceSize = sliceSize || 512;

			const byteCharacters = atob(b64Data);
			const byteArrays = [];

			for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				const slice = byteCharacters.slice(offset, offset + sliceSize);

				const byteNumbers = new Array(slice.length);
				for (let i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				const byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}

			const blob = new Blob(byteArrays, { type: contentType });
			return blob;
		}
	};
}());
