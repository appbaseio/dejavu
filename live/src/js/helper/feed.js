// This file contains all the logic for your app
// authentication and streaming data from your
// endpoint.
// **Configs:** Appname and Credentials
/* global $, Appbase */
// Get data size according to window height
'use strict';

function getDataSize() {
	var mininum_data_size = 20;
	var winHeight = $(window).height() - 150;
	var rowHeight = 51;
	var min_rows = Math.ceil(winHeight / rowHeight);
	var rows = min_rows < mininum_data_size ? mininum_data_size : min_rows;
	return rows;
}

const DATA_SIZE = getDataSize();
var APPNAME, USERNAME, PASSWORD, dejavuURL, OperationFlag, APPURL, input_state, HOST, streamingInterval, fullColumns;
var appbaseRef;
var getMapFlag = false;
var appAuth = true;
var exportJsonData = [];
var counterStream, streamRef;
let esVersion = 2;	// default ES version

// Instantiating appbase ref with the global configs defined above.
function init() {
	appbaseRef = PASSWORD === 'test' ?
		new Appbase({
			url: dejavuURL,
			appname: APPNAME
		}) :
		new Appbase({
			url: dejavuURL,
			appname: APPNAME,
			username: USERNAME,
			password: PASSWORD
		});
}

// parse the url and detect username, password
function filterUrl(url) {
	if (url) {
		var obj = {
			username: 'test',
			password: 'test',
			url: url
		};
		var urlsplit = url.split(':');
		try {
			obj.username = urlsplit[1].replace('//', '');
			var httpPrefix = url.split('://');
			if (urlsplit[2]) {
				var pwsplit = urlsplit[2].split('@');
				obj.password = pwsplit[0];
				if (url.indexOf('@') !== -1) {
					obj.url = httpPrefix[0] + '://' + pwsplit[1];
					if (urlsplit[3]) {
						obj.url += ':' + urlsplit[3];
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
		return obj;
	} else {
		return null;
	}
}

//If default = true then take it from config.js
var browse_url = window.location.href;
var flag_url = browse_url.split('?default=')[1] === 'true' || browse_url.split('?default=')[1] === true;

if (BRANCH === 'dev' || BRANCH === 'master' || BRANCH === 'gh-pages') {
	if (!flag_url || decryptedData.hasOwnProperty('url')) {
		config = {
			url: storageService.getItem('esurl'),
			appname: storageService.getItem('appname')
		};
	}
	beforeInit();
} else if (BRANCH === 'appbase') {
	parent.globalAppData(function(res) {
		APPNAME = res.appname;
		USERNAME = res.username;
		PASSWORD = res.password;
		APPURL = 'https://' + USERNAME + ':' + PASSWORD + '@scalr.api.appbase.io';
		storageService.setItem('esurl', APPURL);
		storageService.setItem('appname', APPNAME);
		config = {
			url: APPURL,
			appname: APPNAME
		};
		beforeInit();
	});
} else {
	storageService.getItem('esurl', function(result) {
		config.url = result.esurl;
		$('#configUrl').val(config.url);
		storageService.getItem('appname', function(result1) {
			config.appname = result1.appname;
			$('#configAppname').val(config.appname);
			beforeInit();
		});
	});
}

function beforeInit() {
	APPNAME = config.appname;
	dejavuURL = config.url;
	if (dejavuURL) {
		var parsedUrl = filterUrl(dejavuURL);
		USERNAME = parsedUrl.username;
		PASSWORD = parsedUrl.password;
		dejavuURL = parsedUrl.url;
		HOST = parsedUrl.url;
		APPURL = dejavuURL + '/' + APPNAME;
		OperationFlag = false;

		// to store input state
		input_state = {
			url: config.url,
			appname: APPNAME
		};

		// update ES version if not appbase domain
		if (dejavuURL.indexOf('scalr.api.appbase.io') === -1) {
			$.ajax({
				type: 'GET',
				url: dejavuURL,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				success: (res) => {
					const nextVersion = parseInt(res.version.number, 10);
					if (nextVersion) {
						esVersion = nextVersion;
					}
				},
				error: () => {
					console.error('Unable to fetch elasticsearch version');	// eslint-disable-line
				}
			});
		} else {
			esVersion = 2;
		}
		init();
	}
}

// vars for tracking current data and types
var sdata = {}; // data to be displayed in table
var headers = ['_type', '_id'];
var esTypes = []; // all the types in current 'app'
var subsetESTypes = []; // currently 'selected' types

var feed = (function() {

	//This function is built only to maintain the total number of records
	//It's hard to figure out correct total number of records while streaming and filtering is together
	function countStream(types, setTotal, query) {
		var defaultQuery = {
			'query': {
				'match_all': {}
			}
		};
		query = query ? query : defaultQuery;
		appbaseRef.search({
			type: types,
			body: query
		}).on('data', function(res) {
			if (res && res.hits && res.hits.total) {
				setTotal(res.hits.total);
			}
		});

		//Stop old stream
		if (typeof counterStream !== 'undefined') {
			counterStream.stop();
		}

		counterStream = appbaseRef.searchStream({
			type: types,
			body: query
		}).on('data', function(res2) {
			//For update data
			if (res2._updated) {
				console.log('Updated');
			} else if (res2._deleted) {
				setTotal(0, true, 'delete');
			}
			//For Index data
			else {
				setTotal(0, true, 'index');
			}
		}).on('error', function(err) {
			console.log('caught a stream error', err);
		});
	}

	function allowOtherOperation() {
		setTimeout(function() {
			OperationFlag = false;
		}, 500);
	}

	// ajax call instead of appbase search, to use preference in search query
	function applyAppbaseSearch(finalUrl, queryBody, cb_succes, cb_error) {
		$.ajax({
			type: 'POST',
			beforeSend: (request) => {
				if (PASSWORD !== 'test') {
					request.setRequestHeader('Authorization', 'Basic ' + btoa(USERNAME + ':' + PASSWORD));
				}
			},
			url: finalUrl,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(queryBody),
			success: function(res) {
				cb_succes(res);
			},
			error: function() {
				$('.full_page_loading').addClass('hide');
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
			var defaultQueryBody = {
				query: {
					match_all: {}
				}
			};
			queryBody = queryBody ? queryBody : defaultQueryBody;
			var typesString = typeName.join(',');
			var finalUrl = HOST + '/' + APPNAME + '/' + typesString + '/_search?preference=abcxyz&from=' + from + '&size=' + DATA_SIZE;
			applyAppbaseSearch(finalUrl, queryBody, function(res) {
				callback(res.hits.hits);
			});
		}
	}

	// applies a searchStream() query on a particular ``type``
	// to establish a continuous query connection.
	// use applyAppbaseSearch to get the data
	function applyStreamSearch(types, callback, queryBody, setTotal, streamQuery) {
		if (types !== null) {
			var defaultQueryBody = {
				query: {
					match_all: {}
				}
			};
			queryBody = queryBody ? queryBody : defaultQueryBody;
			var dataSize = Object.keys(sdata).length;
			sdata = {}; // we can't reliably keep state once type info changes, hence we fetch everything again.
			var typesString = types;
			try {
				typesString = types.join(',');
			} catch (e) {
				console.log(e, types);
			}
			var finalUrl = HOST + '/' + APPNAME + '/' + typesString + '/_search?preference=abcxyz&from=' + 0 + '&size=' + Math.max(dataSize, DATA_SIZE);
			applyAppbaseSearch(finalUrl, queryBody, function(res) {
				try {
					var hits, flag, total;
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
			}, function() {
				allowOtherOperation();
			});

			// Counter stream
			countStream(types, setTotal, streamQuery);

			//Stop old stream
			if (typeof streamRef !== 'undefined') {
				streamRef.stop();
			}

			// get new data updates
			streamRef = appbaseRef.searchStream({
				type: types,
				body: queryBody
			}).on('data', function(res) {
				if (res.hasOwnProperty('_updated')) {
					delete res._updated;
				}
				callback(res, true);
			}).on('error', function(err) {
				console.log('caught a stream error', err);
			});
		}
	}

	return {
		countStream: function(types, setTotal, query) {
			countStream(types, setTotal, query);
		},
		// exposes ``applyStreamSearch()`` as ``getData()``
		getData: function(types, callback, setTotal) {
			applyStreamSearch(types, callback, false, setTotal);
		},
		// ``deleteData()`` deletes the data records when
		// a type is unchecked by the user.
		deleteData: function(typeName, callback) {
			var localSdata = {};
			for (var data in sdata) {
				if (sdata[data]._type !== typeName) {
					localSdata[data] = sdata[data];
				}
			}
			sdata = localSdata;
			callback(sdata);
		},
		// ``paginateData()`` scrolls new results using the
		// datatable's current length.
		paginateData: function(total, callback, queryBody, types) {
			types = types ? types : subsetESTypes;
			paginationSearch(types, Object.keys(sdata).length, callback, (queryBody !== null) ? queryBody : null);
		},
		// gets all the types of the current app;
		getTypes: function(callback) {
			if (typeof APPNAME !== 'undefined') {
				this.filterType().done(function(data) {
					var buckets = data.aggregations.count_by_type.buckets;
					var types = buckets.filter(function(bucket) {
						return bucket.doc_count > 0;
					});
					types = types.map(function(bucket) {
						return bucket.key;
					});
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
				}).error(function(xhr) {
					console.log(xhr);
					clearInterval(streamingInterval);
					console.log('error in retrieving types: ', xhr);
				});
			} else {
				var $this = this;
				setTimeout(function() {
					$this.getTypes(callback);
				}, 1000);
			}
		},
		getAggregations: (type, field, callback) => {
			appbaseRef
				.search({
					type,
					body: {
						aggs: {
							field: {
								terms: { field: `${field}.raw`, size: 100 }
							}
						}
					}
				})
				.on('data', (res) => {
					if (callback) {
						callback(field, res.aggregations.field.buckets);
					}
				})
				.on('error', (err) => {
					console.error(err);
				});
		},
		indexData: function(recordObject, method, callback) {
			console.log(recordObject);
			var self = this;
			if (method === 'index' || method === 'bulk') {
				applyIndexOrBulk(method);
			} else {
				var doc = recordObject.body;
				recordObject.body = {
					doc: doc
				};
				console.log(recordObject);
				appbaseRef.update(recordObject).on('data', function(res) {
					if (method === 'updateCell' && callback) {
						callback(res);
					} else if (callback) {
						return callback();
					}
				});
			}

			function applyIndexOrBulk(method) {
				appbaseRef[method](recordObject).on('data', function(res) {
					if (esTypes.indexOf(recordObject.type) === -1) {
						self.getTypes(function(newTypes) {
							if (callback) {
								return callback(res, newTypes);
							}
						});
					} else {
						return callback(res);
					}
				}).on('error', function(err) {
					return callback(err);
				});
			}
		},
		deleteRecord: (selectedRows, callback) => {
			function deleteData(sdata, data) {
				selectedRows.forEach(function(v) {
					if (typeof sdata[data] !== 'undefined') {
						if (sdata[data]._type === v._type && sdata[data]._id === v._id) {
							delete sdata[data];
						}
					}
				});
			}

			if (selectedRows.length === 1) {
				appbaseRef.delete({
					type: selectedRows[0]._type,
					id: selectedRows[0]._id
				})
					.on('data', (res) => {
						callback(sdata);
					})
					.on('error', (err) => {
						console.error('Error while trying to delete: ', err);
					});
			} else {
				const deleteArray = selectedRows.map(function(v) {
					return { delete: v };
				});

				appbaseRef.bulk({
					body: deleteArray
				}).on('data', function(data) {
					for (var record in sdata) {
						if (sdata.hasOwnProperty(record)) {
							deleteData(sdata, record);
						}
					}
					callback(sdata);
				});
			}
		},
		getSingleDoc: function(type, callback) {
			appbaseRef.search({
				type: type,
				from: 0,
				size: 1,
				body: {
					query: {
						match_all: {}
					}
				}
			}).on('data', function(data) {
				callback(data);
			});
		},
		getEsVersion: () => esVersion,
		getMapping: function() {
			var createUrl = HOST + '/' + APPNAME + '/_mapping';
			return $.ajax({
				type: 'GET',
				beforeSend: (request) => {
					if (PASSWORD !== 'test') {
						request.setRequestHeader('Authorization', 'Basic ' + btoa(USERNAME + ':' + PASSWORD));
					}
				},
				url: createUrl
			});
		},
		createMapping: function(type, queryBody, callback) {
			var createUrl = HOST + '/' + APPNAME + '/_mapping/' + type;
			return $.ajax({
				type: 'POST',
				beforeSend: (request) => {
					if (PASSWORD !== 'test') {
						request.setRequestHeader('Authorization', 'Basic ' + btoa(USERNAME + ':' + PASSWORD));
					}
				},
				url: createUrl,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(queryBody),
				error: res => callback(res.responseJSON)
			});
		},
		applyQuery: function(url, queryBody) {
			return $.ajax({
				type: 'POST',
				beforeSend: (request) => {
					if (PASSWORD !== 'test') {
						request.setRequestHeader('Authorization', 'Basic ' + btoa(USERNAME + ':' + PASSWORD));
					}
				},
				url: url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(queryBody)
			});
		},
		applyGetQuery: function(temp_config, ajaxType) {
			var ajaxType = ajaxType ? ajaxType : 'GET';
			return $.ajax({
				type: ajaxType,
				beforeSend: (request) => {
					if (temp_config.password !== 'test') {
						request.setRequestHeader('Authorization', 'Basic ' + btoa(temp_config.username + ':' + temp_config.password));
					}
				},
				url: temp_config.url
			});
		},
		filterType: function() {
			var createUrl = HOST + '/' + APPNAME + '/_search?search_type=query_then_fetch';
			var queryBody = {
				'size': 0,
				'aggs': {
					'count_by_type': {
						'terms': {
							'field': '_type',
							"size": 1000000
						}
					}
				}
			};
			return this.applyQuery(createUrl, queryBody);
		},
		scrollapi: function(types, queryBody, scroll, scroll_id) {
			var typesString = types.join(',');
			var createUrl = HOST + '/' + APPNAME + '/' + typesString + '/_search?scroll=5m';
			var scrollUrl = HOST + '/_search/scroll?scroll=5m&scroll_id=' + scroll_id;
			var finalUrl = scroll ? scrollUrl : createUrl;
			return this.applyQuery(finalUrl, queryBody);
		},
		testQuery: function(types, queryBody) {
			// get historical data
			return appbaseRef.search({
				type: types,
				from: 0,
				size: 0,
				body: queryBody
			});
		},
		getTotalRecord: function() {
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
		getIndices: function(url) {
			var temp_config = this.filterUrl(url);
			if (temp_config) {
				temp_config.url += '/_stats/indices';
				return this.applyGetQuery(temp_config);
			} else {
				return null;
			}
		},
		checkIndex: function(url, appname) {
			return this.executeIndexOperation(url, appname);
		},
		createIndex: function(url, appname) {
			return this.executeIndexOperation(url, appname);
		},
		executeIndexOperation: function(url, appname) {
			var temp_config = this.filterUrl(url);
			if (temp_config) {
				temp_config.url += '/' + appname;
				console.log(temp_config);
				return this.applyGetQuery(temp_config, 'POST');
			} else {
				return null;
			}
		},
		filterUrl: function(url) {
			return filterUrl(url);
		},
		externalQuery: function(query, typeName, callback, setTotal) {
			this.externalQueryBody = query;
			this.externalQueryType = typeName;
			applyStreamSearch(typeName, callback, this.externalQueryBody, setTotal, query);
		},
		removeExternalQuery: function() {
			delete this.externalQueryBody;
		},
		filterQuery: function(filterQuerys, typeName, callback, setTotal) {
			this.queryBody = this.generateFilterQuery(filterQuerys);
			applyStreamSearch(typeName, callback, this.queryBody, setTotal);
		},
		generateFilterQuery(filterQuerys) {
			var queries = [];
			filterQuerys.forEach(function(filterItem) {
				var query = this.createFilterQuery(filterItem.method, filterItem.columnName, filterItem.value, filterItem.analyzed);
				queries.push(query);
			}.bind(this));
			var queryBody = {
				query: {
					bool: {
						must: queries
					}
				}
			};
			return queryBody;
		},
		//Create Filter Query by passing attributes
		createFilterQuery: function(method, columnName, value, analyzed) {
			var queryBody = {};
			var queryMaker = [];
			var subQuery;

			function setQuery() {
				subQuery = analyzed ? 'match' : 'term';
				value.forEach(function(val) {
					var termObj = {};
					termObj[columnName] = val.trim();
					var obj = {};
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
					'range': termObj
				};
				return termObj;
			}

			function createHasQuery(queryMaker) {
				var boolQuery = {
					'minimum_should_match': 1
				}
				var boolType = method === 'has' ? 'must' : 'must_not';
				boolQuery[boolType] = queryMaker;
				return {
					'bool': boolQuery
				};
			}

			switch (method) {
				case 'has':
				case 'has not':
					//If field is analyzed use MATCH else term
					queryMaker = setQuery();
					queryBody = createHasQuery(queryMaker);
					break;

				case 'search':
					var termObj = {};
					termObj[columnName] = value[0].trim();
					queryBody = {
						'match': termObj
					};
					break;

				case 'greater than':
					termObj = gtLtQuery('gte');
					break;

				case 'less than':
					termObj = gtLtQuery('lte');
					break;

				case 'range':
					var rangeVal = value[0].split('@');
					termObj = {};
					termObj[columnName] = {};
					termObj[columnName] = {
						'gte': rangeVal[0],
						'lte': rangeVal[1]
					};
					queryBody = {
						'range': termObj
					};
					break;

				case 'term':
					termObj = {};
					termObj[columnName] = value[0].trim();
					queryBody = {
						'term': termObj
					};
					break;
			}
			return queryBody;
		},
		b64toBlob: function(b64Data, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;

			var byteCharacters = atob(b64Data);
			var byteArrays = [];

			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				var byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}

			var blob = new Blob(byteArrays, { type: contentType });
			return blob;
		}
	};

}());
