//Help object which contains the helper function and we can use this in homePage component
var help = {
	flatten: function(data) {
		var fields = [];
		if (data != null) {
			for (var each in data['_source']) {
				data[each] = data['_source'][each];
				if (typeof data[each] !== 'string') {
					if (typeof data[each] !== 'number') {
						fields.push(each);
					}
				}
			}
			data['json'] = data['_source'];
			if (data['_source'])
				delete data['_source'];
			if (data['_index'])
				delete data['_index'];
			if (data['_score'])
				delete data['_score'];
		}

		return {
			data: data,
			fields: fields
		};
	},
	getOrder: function(itemIn) {
		var finalVal = false;
		if (itemIn == this.currentItem) {
			if (!this.currentOrder)
				finalVal = true;
		} else {
			this.currentItem = itemIn;
		}
		this.currentOrder = finalVal;
		return finalVal;
	},
	sortIt: function(arr, prop, reverse) {
		var $this = this;
		var existsOnly = _.filter(arr, function(elm) {
			return typeof elm[prop] != 'undefined'
		});
		var nonExistsOnly = _.filter(arr, function(elm) {
			return typeof elm[prop] == 'undefined'
		});

		var a2 = existsOnly.sort($this.dynamicSort(prop, reverse));
		var a2 = $.merge(a2, nonExistsOnly);
		return a2;
	},
	dynamicSort: function(property, reverse) {
		return function(a, b) {
			sortOrder = reverse ? -1 : 1;
			if (property == 'json')
				property = '_type';
			if (isNaN(a[property]) && !Array.isArray(a[property]))
				var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
			else
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	},
	exportData: function() {
		var form = $('#addObjectForm_export').serializeArray();
		var exportObject = {
			type: [],
			username: PROFILE.name
		};
		form.forEach(function(val) {
			if (val.name == 'type') {
				exportObject.type.push(val.value);
			} else if (val.name == 'body') {
				exportObject.query = JSON.parse(val.value);
			}
		});
		$('#exportBtn').addClass('loading').attr('disabled', true);
		return exportObject;
	},
	selectRecord: function(actionOnRecord, id, type, row, currentCheck, documents) {
		var row = {};
		selectedRows = [];
		$('.rowSelectionCheckbox:checked').each(function(i, v) {
			var obj = {
				_id: $(v).attr('value'),
				_type: $(v).data('type')
			};
			selectedRows.push(obj);
			if (i === 0) {
				row = $(v).data('row').json;
				actionOnRecord.id = obj._id;
				actionOnRecord.type = obj._type;
			}
		});
		actionOnRecord.active = selectedRows.length ? true : false;
		actionOnRecord.selectedRows = selectedRows;
		// actionOnRecord.row = JSON.stringify(row, null, 4);
		return {
			actionOnRecord: actionOnRecord
		};
	},
	removeSelection: function(actionOnRecord) {
		actionOnRecord.active = false;
		actionOnRecord.id = null;
		actionOnRecord.type = null;
		actionOnRecord.selectedRows = [];
		return {
			actionOnRecord: actionOnRecord
		};
		return actionOnRecord;
	},
	selectAll: function(checked, actionOnRecord, documents) {
		if (checked) {
			actionOnRecord.selectedRows = [];
			_.each(documents, function(ele) {
				var obj = {
					_id: ele._id,
					_type: ele._type
				};
				actionOnRecord.selectedRows.push(obj);
			});
		} else {
			actionOnRecord.selectedRows = this.removeSelection(actionOnRecord);
		}
		return actionOnRecord;
	},
	setCodeMirror: function(eleId) {
		var options = {
			lineNumbers: true,
			mode: "application/ld+json",
			lineWrapping: true,
			matchBrackets: true,
			showCursorWhenSelecting: true,
			tabSize: 2,
			extraKeys: {
				"Ctrl-Q": function(cm) {
					cm.foldCode(cm.getCursor());
				}
			},
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		};
		return CodeMirror.fromTextArea(document.getElementById(eleId), options);
	},
	normalizeIndexData: function(data) {
		let response = {
			data: {
				name: 'body',
				value: null
			},
			method: null
		};
		data = JSON.parse(data);
		if (_.isArray(data)) {
			let bulkData = [];
			data.forEach(function(item) {
				let obj1 = { index: {} };
				bulkData.push(obj1);
				bulkData.push(item);
			});
			response.data.value = bulkData;
			response.method = 'bulk';
		} else {
			response.data.value = data;
			response.method = 'index';
		}
		return response;
	},
	resetInfoObj: function(userTouchAdd) {
		return {
			showing: 0,
			total: 0,
			getOnce: false,
			availableTotal: 0,
			searchTotal: 0,
			userTouchAdd: userTouchAdd
		}
	},
	resetData: function(total, sdata_key, sortInfo, infoObj, hiddenColumns, selectedTypes, mappingObj) {
		var sortedArray = [];
		var sdata_values = [];
		Object.keys(sdata).forEach((each) => {
			if (!(sdata_key && each === sdata_key)) {
				sdata_values.push(sdata[each]);
			}
		})
		if (sdata_key) {
			sdata_values.unshift(sdata[sdata_key]);
		}

		//if sort is already applied
		if (sortInfo.active) {
			// sortedArray = help.sortIt(sdata_values, sortInfo.column, sortInfo.reverse);
			sortedArray = sdata_values;
		}
		//by default sort it by typename by passing json field
		else if (!sdata_key) {
			sortedArray = help.sortIt(sdata_values, 'json', false);
		} else {
			sortedArray = sdata_values;
		}
		infoObj.showing = sortedArray.length;
		if (typeof total != 'undefined' && total !== null) {
			infoObj.searchTotal = total;
		}
		var data = sortedArray;
		var visibleColumns = [];
		var availableColumns = [];
		Object.keys(sdata).forEach((each) => {
			Object.keys(sdata[each]).forEach((column) => {
				// if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type') {
				if (column != '_id' && column != '_type') {
					if (visibleColumns.indexOf(column) <= -1 && hiddenColumns.indexOf(column) == -1) {
						visibleColumns.push(column);
					}
					if (availableColumns.indexOf(column) <= -1)
						availableColumns.push(column);
				}
			});
		});

		// identify and add new columns from mappingObj
		if (selectedTypes.length) {
			selectedTypes.forEach((selectedType) => {
				if (mappingObj[selectedType]) {
					if (mappingObj[selectedType].properties) {
						const allProperties = Object.keys(mappingObj[selectedType].properties);
						allProperties.forEach((item) => {
							if (!visibleColumns.includes(item) && !hiddenColumns.includes(item)) {
								visibleColumns.push(item);
								availableColumns.push(item);
							}
						});
					}
				}
				// since a new object type has no mapping added, populate the column from _meta
				if (mappingObj[selectedType] && mappingObj[selectedType]._meta) {
					if (Object.prototype.hasOwnProperty.call(mappingObj[selectedType]._meta, 'dejavuMeta')) {
						const metaFields = Object.keys(mappingObj[selectedType]._meta.dejavuMeta);
						metaFields.forEach((item) => {
							if (!visibleColumns.includes(item) && !hiddenColumns.includes(item)) {
								visibleColumns.push(item);
								availableColumns.push(item);
							}
						});
					}
				}
			});
		}

		//set url
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = hiddenColumns;
		createUrl(input_state);

		return {
			documents: sortedArray,
			infoObj: infoObj,
			visibleColumns: visibleColumns,
			hiddenColumns: hiddenColumns,
			pageLoading: false,
			loadingSpinner: false
		};
	},
	countTotalRecord: function(total, fromStream, method, totalRecord) {
		if (fromStream) {
			if (method == 'index')
				totalRecord += 1;
			else if (method == 'delete')
				totalRecord -= 1;
		} else
			totalRecord = total
		return totalRecord;
	},
	countExternalTotalRecord: function(total, fromStream, method, totalRecord) {
		if (fromStream) {
			if (method == 'index')
				totalRecord += 1;
			else if (method == 'delete')
				totalRecord -= 1;
		} else
			totalRecord = total
		return totalRecord;
	},
	streamCallback: function(total, fromStream, method, externalQueryApplied, externalQueryTotal, totalRecord) {
		var reacordObj;
		if (externalQueryTotal) {
			reacordObj = {
				externalQueryTotal: help.countExternalTotalRecord(total, fromStream, method, externalQueryTotal)
			};
			feed.externalQueryTotal = reacordObj.externalQueryTotal;
		} else {
			reacordObj = {
				totalRecord: help.countTotalRecord(total, fromStream, method, totalRecord)
			};
		}
	},
	onEmptySelection: function(infoObj) {
		OperationFlag = false;
		infoObj.showing = 0;
		var totalRecord = 0;
		sdata = {};
		return {
			infoObj: infoObj,
			totalRecord: totalRecord,
			documents: sdata
		};
	},
	getQueryBody: function(filterInfo, externalQueryApplied, cb) {
		var queryBody = null;
		if (externalQueryApplied) {
			queryBody = feed.externalQueryBody;
		} else if (filterInfo.active) {
			queryBody = feed.generateFilterQuery(filterInfo.appliedFilter);
		}
		return queryBody;
	},
	getSelectedTypes: function(filterInfo, externalQueryApplied) {
		var selectedTypes = subsetESTypes;
		if (externalQueryApplied) {
			selectedTypes = feed.externalQueryType;
		}
		return selectedTypes;
	},
	paginateData: function(total, updateDataOnView, queryBody, selectedTypes, sortString) {
		feed.paginateData(total, function(update) {
			updateDataOnView(update);
		}.bind(this), queryBody, selectedTypes, sortString);
	},
	getStreamingTypes: function(getTotalRecord, unwatchStock, setChromeTypes) {
		if (typeof APPNAME == 'undefined' || APPNAME == null) {
			setTimeout(getTotalRecord, 1000);
		} else {
			feed.getTypes(function(update) {
				update = update.sort(function(a, b) {
					return a.toLowerCase().localeCompare(b.toLowerCase());
				});
				subsetESTypes.forEach(function(type) {
					if (update.indexOf(type) === -1) {
						unwatchStock(type);
					}
				});
				setChromeTypes(update);
			});
		}
	},
	setChromeTypes(update) {
		var typeCheck = {};
		storageService.getItem('types', function(result) {
			var types = result.types;
			var value = false;
			try {
				types = JSON.parse(types);
				update.forEach(function(v) {
					var value = types.indexOf(v) !== -1 ? true : false;
					typeCheck[v] = value;
				});
			} catch (e) {
				update.forEach(function(v) {
					var value = false;
				});
			}
		});
		update.forEach(function(v) {
			storageService.getItem(v, function(result) {
				var value = result[v];
				value = value == 'undefined' || typeof value == 'undefined' ? false : value;
				typeCheck[v] = value;
			});
		});
		return {
			update: update,
			typeCheck: typeCheck
		};
	},
	appnameCb: function(appname, indices, url, es_host) {
		var app_match = indices.filter(function(indice) {
			return indice ===  appname;
		});
		var app_match_flag = app_match.length ? true : false;
		var show_index_info = this.state.url === this.state.es_host ? true : false;
		return {
			app_match_flag: app_match_flag,
			current_appname: appname,
			show_index_info: show_index_info
		};
	},
	afterConnect: function() {
		//Set filter from url
		if(decryptedData.filterInfo) {
			decryptedData.filterInfo.applyFilter = this.applyFilter;
			this.setState({
				filterInfo: decryptedData.filterInfo
			});
		}

		//Set hidden columns from url
		if(decryptedData.hiddenColumns) {
			this.setState({
				hiddenColumns: decryptedData.hiddenColumns
			});
		}

		//Set visible columns from url
		if(decryptedData.visibleColumns) {
			this.setState({
				visibleColumns: decryptedData.visibleColumns
			});
		}
	},
	hideAttribute: function(Columns, method) {
		var value = method === 'hide' ? "none" : "";
		Columns.forEach(function(col){
			if(document.getElementById(col) == null || document.getElementById(col) == 'null') {}
			else {
				document.getElementById(col).style.display = value;
				for (var each in sdata) {
					var key = keyGen(sdata[each], col);
					document.getElementById(key).style.display = value
				}
			}
		});
	},
	removeHidden: function(hiddenColumns, visibleColumns) {
		var hiddenColumns = hiddenColumns;
		help.hideAttribute(hiddenColumns, 'show');
		var visibleColumns = visibleColumns.concat(hiddenColumns);
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = [];
		createUrl(input_state);
		return {
			hiddenColumns: [],
			visibleColumns: visibleColumns
		};
	},
	getTotalRecord: function() {
		var $this = this;
		if (!this.state.infoObj.getOnce) {
			if (typeof APPNAME == 'undefined' || APPNAME == null) {
				setTimeout(this.getTotalRecord, 1000);
			} else {
				feed.getTotalRecord().on('data', function(data) {
					if(queryParams.query) {
						setTimeout(function() {
							$this.externalQuery(JSON.parse(queryParams.query));
						}, 1000*5);
					}
					var infoObj = $this.state.infoObj;
					infoObj.getOnce = true;
					infoObj.availableTotal = data.hits.total;
					$this.setState({
						infoObj: infoObj
					});
				});
			}
		}
	},
	watchStock: function(typeName) {
		if(this.state.externalQueryApplied) {
			this.removeExternalQuery();
			setTimeout(function() {
				watchCb.call(this);
			}.bind(this), 1000*2);
		} else {
			watchCb.call(this);
		}
		function watchCb() {
			//Remove sorting while slecting new type
			this.setState({
				sortInfo: {
					active: false
				},
				cleanTypes: false
			});

			//Remove sortInfo from store
			if(input_state.hasOwnProperty('sortInfo')) {
				delete input_state.sortInfo;
				createUrl(input_state);
			}
			window.stop();
			subsetESTypes.push(typeName);
			this.applyGetStream();
			input_state.selectedType = subsetESTypes;
			createUrl(input_state);
		}
	},
	typeCounter: function(typeInfo) {
		typeInfo.count++;
		return {
			typeInfo: typeInfo
		};
	},
	handleSort: function(item, type, eve, order, docs) {
		var res = {
			sortInfo: null,
			documents: null
		};
		if(!order) {
			order = help.getOrder(item);
		}
		var storObj = {
			active: true,
			column: item,
			type: type,
			reverse: order
		};
		res.sortInfo = storObj;

		//Store state of sort
		if(decryptedData.sortInfo)
			delete decryptedData.sortInfo;
		var sort_state = JSON.parse(JSON.stringify(storObj));
		input_state.sortInfo = sort_state;
		createUrl(input_state);
		var sortedArray = help.sortIt(docs, item, order);
		res.documents = docs;
		return res;
	},
	addRecord: function(editorref, indexCall) {
		var form = $('#addObjectForm').serializeArray();
		var indexData = help.normalizeIndexData(editorref.getValue().trim());
		if(indexData.method) {
			form.push(indexData.data);
			indexCall(form, 'close-modal', indexData.method);
		}
	},
	updateRecord: function(editorref, indexCall, columnName) {
		var form = $('#updateObjectForm').serializeArray();
		var indexData = JSON.parse(editorref.getValue().trim());
		if (columnName) {
			indexData = {
				[columnName]: indexData
			};
		}
		var obj = {
			name: 'body',
			value: indexData
		};
		form.push(obj);
		var recordObject = {};
		indexCall(form, 'close-update-modal', 'update');
	},
	showSample: function(obj, editorref, userTouchFlag) {
		if(userTouchFlag && editorref.getValue().trim() != ''){}
		else{
			var convertJson = obj.hasOwnProperty('json') ? obj.json : obj;
			var objJson = JSON.stringify(convertJson, null, 2);
			editorref.setValue(objJson);
		}
	},
	filterSampleData: function(data, setSampleData) {
		var filteredType = [];
		data.filter(function(record, index) {
			if(filteredType.indexOf(record['_type']) < 0) {
				filteredType.push(record['_type']);
				setSampleData(record);
			}
		}.bind(this));
	},
	setSampleData: function(update, typeDocSample) {
		var typeDocSample = typeDocSample ? typeDocSample : {};
		typeDocSample[update['_type']] = $.extend({}, update);
		delete typeDocSample[update['_type']]._id;
		delete typeDocSample[update['_type']]._type;
		return {
			typeDocSample: typeDocSample
		};
	},
	hideUrlChange: function(hideUrl) {
		hideUrl = hideUrl ? false : true;
		return {
			hideUrl: hideUrl
		};
	},
	setApps: function(authFlag, getApps, cb) {
		var self = this;
		if(BRANCH !== 'chrome') {
			getApps(getAppsCb);
		} else {
			storageService.getItem('historicApps', getAppsCb);
		}
		function getAppsCb(result) {
			var apps = result.historicApps;
			if(apps) {
				try {
					apps = JSON.parse(apps);
				} catch(e) {
					apps = [];
				}
			} else {
				apps = [];
			}
			var app = {
				url: config.url,
				appname: config.appname
			};
			var historicApps = apps;
			if(authFlag) {
				if(historicApps && historicApps.length) {
					historicApps.forEach(function(old_app, index) {
						if(old_app.appname === app.appname) {
							historicApps.splice(index, 1);
						}
					})
				}
				if(app.url) {
					historicApps.push(app);
				}
			}
			cb({
				historicApps: historicApps
			});
			storageService.setItem('historicApps', JSON.stringify(historicApps));
		};
	},
	defaultQuery: function() {
		$('.json-spinner').show();
		$('.modal-text').hide();
		return {
			"query": {
				"match_all": {}
			},
			"size":1000
		};
	},
	getReloadFlag: function() {
		var reloadFlag = true;
		var formInfo = $('#init-ES').serializeArray();
		formInfo.forEach(function(v) {
			if(v.value.trim() === '') {
				reloadFlag = false;
			}
		});
		return reloadFlag;
	},
	connectPlayOrPause: function(connect, userTouchAdd) {
		var info = null;
		var connectToggle = connect ? false: true;
		window.location.href = "#?input_state=''";
		if(!connectToggle) {
			subsetESTypes = [];
			info = {
				connect: connectToggle,
				documents: [],
				types: [],
				infoObj: help.resetInfoObj(userTouchAdd)
			};
		}
		return info;
	},
	scrollapi: function(data, scrollApi) {
		var hits = data.hits.hits;
		exportJsonData = exportJsonData.concat(hits);
		var str = null;
		if(hits.length > 999) {
			var scrollObj = {
				'scroll': '5m',
				'scroll_id': data._scroll_id
			};
			scrollApi({"activeQuery": scrollObj, "scroll": true, "scroll_id": data._scroll_id});
		}
		else {
			str = JSON.stringify(exportJsonData, null, 4);
			$('.json-spinner').hide();
			$('.modal-text').show();
			exportJsonData = [];
		}
		return str;
	},
	initEs: function() {
		var formInfo = $('#init-ES').serializeArray();
		var temp_config = {
			url: '',
			appname: ''
		};
		formInfo.forEach(function(v) {
			if(v.value === '') {
				reloadFlag = false;
			}
			if(v.name == 'url'){
				temp_config.url = v.value;
			}
			else{
				temp_config.appname = v.value;
			}
		});
		storageService.setItem('esurl',temp_config.url);
		storageService.setItem('appname',temp_config.appname);
		config = temp_config;
		return temp_config;
	},
	deleteRecord: function(infoObj, actionOnRecord, removeSelection, resetData, getStreamingTypes, reloadData) {
		$('.loadingBtn').removeClass('loading');
		$('#close-delete-modal').click();
		$('.close').click();
		infoObj.total -= actionOnRecord.selectedRows.length;
		removeSelection();
		resetData();
		setTimeout(function() {
			getStreamingTypes();
			reloadData();
		}.bind(this), 1000);
		return infoObj;
	},
	getUpdateObj: function(actionOnRecord, documents) {
		var current_selected_row = actionOnRecord.selectedRows[0];
		var current_row = _.filter(documents, function(ele) {
			return ele._type == current_selected_row._type && ele._id == current_selected_row._id;
		});
		actionOnRecord.row = JSON.stringify(current_row[0].json, null, 4);
		return actionOnRecord;
	},
	watchSelectedRecord: function(actionOnRecord) {
		actionOnRecord.selectedRows = _.filter(this.state.actionOnRecord.selectedRows, function(row) {
			var flag = subsetESTypes.indexOf(row._type) === -1 ? false : true;
			return flag;
		});
		return actionOnRecord;
	},
	toggleIt: function(elementId, checked, visibleColumns, hiddenColumns) {
		if (!checked) {
			//visible columns - update
			visibleColumns = visibleColumns.filter(function(v){
				if (v != elementId) return v;
			});
			//hidden columns - update
			var flag = hiddenColumns.indexOf(elementId);
			if (flag == -1) {
				hiddenColumns.push(elementId);
			}
		} else {
			//visible columns - update
			var flag = visibleColumns.indexOf(elementId);
			if (flag == -1) {
				visibleColumns.push(elementId);
			}
			//hidden columns - update
			var hiddenColumns = hiddenColumns.filter(function(v){
				if (v != elementId) return v;
			});
		}
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = hiddenColumns;
		createUrl(input_state);
		return {
			visibleColumns: visibleColumns,
			hiddenColumns: hiddenColumns
		};
	},
	removeSort: function(sortInfo) {
		if(input_state.hasOwnProperty('sortInfo')) {
			delete input_state.sortInfo;
			createUrl(input_state);
		}
		return {
			sortInfo: Object.assign(
				{},
				sortInfo,
				{ active: false }
			)
		};
	},
	removeFilter: function(index, externalQueryApplied, filterInfo, applyFilter, resetData, getStreamingData, removeSelection, applyFilterFn, callback) {
		var appliedFilter = filterInfo.appliedFilter;
		appliedFilter.splice(index, 1);
		var obj = {
			active: appliedFilter.length ? true : false,
			applyFilter: applyFilter,
			appliedFilter: appliedFilter
		};
		//Remove filterInfo from store
		if(!obj.active) {
			if(input_state.hasOwnProperty('filterInfo')) {
				delete input_state.filterInfo;
				createUrl(input_state);
			}
			if(!externalQueryApplied) {
				sdata = [];
				resetData();
				setTimeout(function() {
					getStreamingData(subsetESTypes);
				}, 500);
			}
			removeSelection();
		} else {
			applyFilterFn(subsetESTypes);
		}
		if (callback) {
			setTimeout(callback, 700);
		}
		return {
			filterInfo: obj
		};
	},
	externalQueryPre: function(query, removeTypes) {
		try {
			query.query = JSON.parse(query.query);
		} catch(e) {}
		try {
			query.type = JSON.parse(query.type);
		} catch(e) {}
		removeTypes();
		$('.full_page_loading').removeClass('hide');
		return {
			extQuery: query.query,
			extType: query.type,
			externalQueryApplied: true
		};
	},
	applyFilter: function(typeName, columnName, method, value, analyzed, filterInfo) {
		var filterVal;
		if(columnName) {
			filterVal = $.isArray(value) ? value : value.split(',');
			var filterObj = {};
			filterObj['type'] = typeName;
			filterObj['columnName'] = columnName;
			filterObj['method'] = method;
			filterObj['value'] = filterVal;
			filterObj['active'] = true;
			filterObj['analyzed'] = analyzed;
			if(filterInfo.appliedFilter) {
				filterInfo.appliedFilter.push(filterObj);
			} else {
				filterInfo.appliedFilter = [filterObj];
			}
			filterInfo.active = true;
		}
		//Store state of filter
		var filter_state = JSON.parse(JSON.stringify(filterInfo));
		delete filter_state.applyFilter;
		input_state.filterInfo = filter_state;
		createUrl(input_state);
		return {
			filterInfo: filterInfo
		};
	}
}
