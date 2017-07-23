// Help object which contains the helper function and we can use this in homePage component
var help = {
	flatten(data) {
		const fields = [];
		if (data != null) {
			for (const each in data._source) {
				data[each] = data._source[each];
				if (typeof data[each] !== "string") {
					if (typeof data[each] !== "number") {
						fields.push(each);
					}
				}
			}
		}
		data.json = data._source;
		if (data._source)			{ delete data._source; }
		if (data._index)			{ delete data._index; }
		if (data._score)			{ delete data._score; }

		return {
			data,
			fields
		};
	},
	getOrder(itemIn) {
		let finalVal = false;
		if (itemIn == this.currentItem) {
			if (!this.currentOrder)				{ finalVal = true; }
		} else {
			this.currentItem = itemIn;
		}
		this.currentOrder = finalVal;
		return finalVal;
	},
	sortIt(arr, prop, reverse) {
		const $this = this;
		const existsOnly = _.filter(arr, elm => typeof elm[prop] !== "undefined");
		const nonExistsOnly = _.filter(arr, elm => typeof elm[prop] === "undefined");

		var a2 = existsOnly.sort($this.dynamicSort(prop, reverse));
		var a2 = $.merge(a2, nonExistsOnly);
		return a2;
	},
	dynamicSort(property, reverse) {
		return function (a, b) {
			sortOrder = reverse ? -1 : 1;
			if (property == "json")				{ property = "_type"; }
			if (isNaN(a[property]))				{ var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0; }			else				{ var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0; }
			return result * sortOrder;
		};
	},
	exportData() {
		const form = $("#addObjectForm_export").serializeArray();
		const exportObject = {
			type: [],
			username: PROFILE.name
		};
		form.forEach((val) => {
			if (val.name == "type") {
				exportObject.type.push(val.value);
			} else if (val.name == "body") {
				exportObject.query = JSON.parse(val.value);
			}
		});
		$("#exportBtn").addClass("loading").attr("disabled", true);
		return exportObject;
	},
	selectRecord(actionOnRecord, id, type, row, currentCheck, documents) {
		var row = {};
		selectedRows = [];
		$(".rowSelectionCheckbox:checked").each((i, v) => {
			const obj = {
				_id: $(v).attr("value"),
				_type: $(v).data("type")
			};
			selectedRows.push(obj);
			if (i === 0) {
				row = $(v).data("row").json;
				actionOnRecord.id = obj._id;
				actionOnRecord.type = obj._type;
			}
		});
		actionOnRecord.active = !!selectedRows.length;
		actionOnRecord.selectedRows = selectedRows;
		// actionOnRecord.row = JSON.stringify(row, null, 4);
		return {
			actionOnRecord
		};
	},
	removeSelection(actionOnRecord) {
		actionOnRecord.active = false;
		actionOnRecord.id = null;
		actionOnRecord.type = null;
		actionOnRecord.selectedRows = [];
		return {
			actionOnRecord
		};
		return actionOnRecord;
	},
	selectAll(checked, actionOnRecord, documents) {
		if (checked) {
			actionOnRecord.selectedRows = [];
			_.each(documents, (ele) => {
				const obj = {
					_id: ele._id,
					_type: ele._type
				};
				actionOnRecord.selectedRows.push(obj);
			});
		} else			{ actionOnRecord.selectedRows = this.removeSelection(actionOnRecord); }

		console.log(actionOnRecord.selectedRows);
		return actionOnRecord;
	},
	setCodeMirror(eleId) {
		const options = {
			lineNumbers: true,
			mode: "application/ld+json",
			lineWrapping: true,
			matchBrackets: true,
			showCursorWhenSelecting: true,
			tabSize: 2,
			extraKeys: {
				"Ctrl-Q": function (cm) {
					cm.foldCode(cm.getCursor());
				}
			},
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		};
		return CodeMirror.fromTextArea(document.getElementById(eleId), options);
	},
	normalizeIndexData(data) {
		const response = {
			data: {
				name: "body",
				value: null
			},
			method: null
		};
		data = JSON.parse(data);
		if (_.isArray(data)) {
			const bulkData = [];
			data.forEach((item) => {
				const obj1 = { index: {} };
				bulkData.push(obj1);
				bulkData.push(item);
			});
			response.data.value = bulkData;
			response.method = "bulk";
		} else {
			response.data.value = data;
			response.method = "index";
		}
		return response;
	},
	resetInfoObj(userTouchAdd) {
		return {
			showing: 0,
			total: 0,
			getOnce: false,
			availableTotal: 0,
			searchTotal: 0,
			userTouchAdd
		};
	},
	resetData(total, sdata_key, sortInfo, infoObj, hiddenColumns) {
		let sortedArray = [];
		const sdata_values = [];
		Object.keys(sdata).forEach((each) => {
			if (!(sdata_key && each === sdata_key)) {
				sdata_values.push(sdata[each]);
			}
		});
		if (sdata_key) {
			sdata_values.unshift(sdata[sdata_key]);
		}

		// if sort is already applied
		if (sortInfo.active) {
			sortedArray = help.sortIt(sdata_values, sortInfo.column, sortInfo.reverse);
		}
		// by default sort it by typename by passing json field
		else if (!sdata_key) {
			sortedArray = help.sortIt(sdata_values, "json", false);
		} else {
			sortedArray = sdata_values;
		}
		infoObj.showing = sortedArray.length;
		if (typeof total !== "undefined" && total !== null) {
			infoObj.searchTotal = total;
		}
		const data = sortedArray;
		const visibleColumns = [];
		const availableColumns = [];
		Object.keys(sdata).forEach((each) => {
			Object.keys(sdata[each]).forEach((column) => {
				// if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type') {
				if (column != "_id" && column != "_type") {
					if (visibleColumns.indexOf(column) <= -1 && hiddenColumns.indexOf(column) == -1) {
						visibleColumns.push(column);
					}
					if (availableColumns.indexOf(column) <= -1)						{ availableColumns.push(column); }
				}
			});
		});

		if (availableColumns.length) {
			hiddenColumns.forEach((col, key) => {
				if (availableColumns.indexOf(col) <= -1)					{ hiddenColumns.splice(key, 1); }
			});
		}
		// set url
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = hiddenColumns;
		createUrl(input_state);

		return {
			documents: sortedArray,
			infoObj,
			visibleColumns,
			hiddenColumns,
			pageLoading: false
		};
	},
	countTotalRecord(total, fromStream, method, totalRecord) {
		if (fromStream) {
			if (method == "index")				{ totalRecord += 1; }			else if (method == "delete")				{ totalRecord -= 1; }
		} else			{ totalRecord = total; }
		return totalRecord;
	},
	countExternalTotalRecord(total, fromStream, method, totalRecord) {
		if (fromStream) {
			if (method == "index")				{ totalRecord += 1; }			else if (method == "delete")				{ totalRecord -= 1; }
		} else			{ totalRecord = total; }
		return totalRecord;
	},
	streamCallback(total, fromStream, method, externalQueryApplied, externalQueryTotal, totalRecord) {
		let reacordObj;
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
	onEmptySelection(infoObj) {
		OperationFlag = false;
		infoObj.showing = 0;
		const totalRecord = 0;
		sdata = {};
		return {
			infoObj,
			totalRecord,
			documents: sdata
		};
	},
	getQueryBody(filterInfo, externalQueryApplied, cb) {
		let queryBody = null;
		if (externalQueryApplied) {
			queryBody = feed.externalQueryBody;
		} else if (filterInfo.active) {
			queryBody = feed.generateFilterQuery(filterInfo.appliedFilter);
		}
		return queryBody;
	},
	getSelectedTypes(filterInfo, externalQueryApplied) {
		let selectedTypes = subsetESTypes;
		if (externalQueryApplied) {
			selectedTypes = feed.externalQueryType;
		}
		return selectedTypes;
	},
	paginateData(total, updateDataOnView, queryBody, selectedTypes) {
		feed.paginateData(total, (update) => {
			updateDataOnView(update);
		}, queryBody, selectedTypes);
	},
	getStreamingTypes(getTotalRecord, unwatchStock, setChromeTypes) {
		if (typeof APPNAME === "undefined" || APPNAME == null) {
			setTimeout(getTotalRecord, 1000);
		} else {
			feed.getTypes((update) => {
				update = update.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
				subsetESTypes.forEach((type) => {
					if (update.indexOf(type) === -1) {
						unwatchStock(type);
					}
				});
				setChromeTypes(update);
			});
		}
	},
	setChromeTypes(update) {
		const typeCheck = {};
		storageService.getItem("types", (result) => {
			let types = result.types;
			const value = false;
			try {
				types = JSON.parse(types);
				update.forEach((v) => {
					const value = types.indexOf(v) !== -1;
					typeCheck[v] = value;
				});
			} catch (e) {
				update.forEach((v) => {
					const value = false;
				});
			}
		});
		update.forEach((v) => {
			storageService.getItem(v, (result) => {
				let value = result[v];
				value = value == "undefined" || typeof value === "undefined" ? false : value;
				typeCheck[v] = value;
			});
		});
		return {
			update,
			typeCheck
		};
	},
	appnameCb(appname, indices, url, es_host) {
		const app_match = indices.filter(indice => indice === appname);
		const app_match_flag = !!app_match.length;
		const show_index_info = this.state.url === this.state.es_host;
		return {
			app_match_flag,
			current_appname: appname,
			show_index_info
		};
	},
	afterConnect() {
		// Set filter from url
		if (decryptedData.filterInfo) {
			decryptedData.filterInfo.applyFilter = this.applyFilter;
			this.setState({
				filterInfo: decryptedData.filterInfo
			});
		}

		// Set hidden columns from url
		if (decryptedData.hiddenColumns) {
			this.setState({
				hiddenColumns: decryptedData.hiddenColumns
			});
		}

		// Set visible columns from url
		if (decryptedData.visibleColumns) {
			this.setState({
				visibleColumns: decryptedData.visibleColumns
			});
		}
	},
	hideAttribute(Columns, method) {
		const value = method === "hide" ? "none" : "";
		Columns.forEach((col) => {
			if (document.getElementById(col) == null || document.getElementById(col) == "null") {}			else {
				document.getElementById(col).style.display = value;
				for (const each in sdata) {
					const key = keyGen(sdata[each], col);
					document.getElementById(key).style.display = value;
				}
			}
		});
	},
	removeHidden(hiddenColumns, visibleColumns) {
		var hiddenColumns = hiddenColumns;
		help.hideAttribute(hiddenColumns, "show");
		var visibleColumns = visibleColumns.concat(hiddenColumns);
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = [];
		createUrl(input_state);
		return {
			hiddenColumns: [],
			visibleColumns
		};
	},
	getTotalRecord() {
		const $this = this;
		if (!this.state.infoObj.getOnce) {
			if (typeof APPNAME === "undefined" || APPNAME == null) {
				setTimeout(this.getTotalRecord, 1000);
			} else {
				feed.getTotalRecord().on("data", (data) => {
					if (queryParams.query) {
						setTimeout(() => {
							$this.externalQuery(JSON.parse(queryParams.query));
						}, 1000 * 5);
					}
					const infoObj = $this.state.infoObj;
					infoObj.getOnce = true;
					infoObj.availableTotal = data.hits.total;
					$this.setState({
						infoObj
					});
				});
			}
		}
	},
	watchStock(typeName) {
		if (this.state.externalQueryApplied) {
			this.removeExternalQuery();
			setTimeout(() => {
				watchCb.call(this);
			}, 1000 * 2);
		} else {
			watchCb.call(this);
		}
		function watchCb() {
			// Remove sorting while slecting new type
			this.setState({
				sortInfo: {
					active: false
				},
				cleanTypes: false
			});

			// Remove sortInfo from store
			if (input_state.hasOwnProperty("sortInfo")) {
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
	typeCounter(typeInfo) {
		typeInfo.count++;
		return {
			typeInfo
		};
	},
	handleSort(item, type, eve, order, docs) {
		const res = {
			sortInfo: null,
			documents: null
		};
		if (!order) {
			order = help.getOrder(item);
		}
		const storObj = {
			active: true,
			column: item,
			reverse: order
		};
		res.sortInfo = storObj;

		// Store state of sort
		if (decryptedData.sortInfo)			{ delete decryptedData.sortInfo; }
		const sort_state = JSON.parse(JSON.stringify(storObj));
		input_state.sortInfo = sort_state;
		createUrl(input_state);
		const sortedArray = help.sortIt(docs, item, order);
		res.documents = sortedArray;
		return res;
	},
	addRecord(editorref, indexCall) {
		const form = $("#addObjectForm").serializeArray();
		const indexData = help.normalizeIndexData(editorref.getValue().trim());
		if (indexData.method) {
			form.push(indexData.data);
			indexCall(form, "close-modal", indexData.method);
		}
	},
	updateRecord(editorref, indexCall) {
		const form = $("#updateObjectForm").serializeArray();
		const indexData = JSON.parse(editorref.getValue().trim());
		const obj = {
			name: "body",
			value: indexData
		};
		form.push(obj);
		const recordObject = {};
		indexCall(form, "close-update-modal", "update");
	},
	showSample(obj, editorref, userTouchFlag) {
		if (userTouchFlag && editorref.getValue().trim() != "") {}		else {
			const convertJson = obj.hasOwnProperty("json") ? obj.json : obj;
			const objJson = JSON.stringify(convertJson, null, 2);
			editorref.setValue(objJson);
		}
	},
	filterSampleData(data, setSampleData) {
		const filteredType = [];
		data.filter((record, index) => {
			if (filteredType.indexOf(record._type) < 0) {
				filteredType.push(record._type);
				setSampleData(record);
			}
		});
	},
	setSampleData(update, typeDocSample) {
		var typeDocSample = typeDocSample || {};
		typeDocSample[update._type] = $.extend({}, update);
		delete typeDocSample[update._type]._id;
		delete typeDocSample[update._type]._type;
		return {
			typeDocSample
		};
	},
	hideUrlChange(hideUrl) {
		hideUrl = !hideUrl;
		return {
			hideUrl
		};
	},
	setApps(authFlag, getApps, cb) {
		const self = this;
		if (BRANCH !== "chrome") {
			getApps(getAppsCb);
		} else {
			storageService.getItem("historicApps", getAppsCb);
		}
		function getAppsCb(result) {
			let apps = result.historicApps;
			if (apps) {
				try {
					apps = JSON.parse(apps);
				} catch (e) {
					apps = [];
				}
			} else {
				apps = [];
			}
			const app = {
				url: config.url,
				appname: config.appname
			};
			const historicApps = apps;
			if (authFlag) {
				if (historicApps && historicApps.length) {
					historicApps.forEach((old_app, index) => {
						if (old_app.appname === app.appname) {
							historicApps.splice(index, 1);
						}
					});
				}
				if (app.url) {
					historicApps.push(app);
				}
			}
			cb({
				historicApps
			});
			storageService.setItem("historicApps", JSON.stringify(historicApps));
		}
	},
	defaultQuery() {
		$(".json-spinner").show();
		$(".modal-text").hide();
		return {
			query: {
				match_all: {}
			},
			size: 1000
		};
	},
	getReloadFlag() {
		let reloadFlag = true;
		const formInfo = $("#init-ES").serializeArray();
		formInfo.forEach((v) => {
			if (v.value.trim() === "") {
				reloadFlag = false;
			}
		});
		return reloadFlag;
	},
	connectPlayOrPause(connect, userTouchAdd) {
		let info = null;
		const connectToggle = !connect;
		window.location.href = "#?input_state=''";
		if (!connectToggle) {
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
	scrollapi(data, scrollApi) {
		const hits = data.hits.hits;
		exportJsonData = exportJsonData.concat(hits);
		let str = null;
		if (hits.length > 999) {
			const scrollObj = {
				scroll: "1m",
				scroll_id: data._scroll_id
			};
			scrollApi({ activeQuery: scrollObj, scroll: true, scroll_id: data._scroll_id });
		}		else {
			str = JSON.stringify(exportJsonData, null, 4);
			$(".json-spinner").hide();
			$(".modal-text").show();
			exportJsonData = [];
		}
		return str;
	},
	initEs() {
		const formInfo = $("#init-ES").serializeArray();
		const temp_config = {
			url: "",
			appname: ""
		};
		formInfo.forEach((v) => {
			if (v.value === "") {
				reloadFlag = false;
			}
			if (v.name == "url") {
				temp_config.url = v.value;
			}			else {
				temp_config.appname = v.value;
			}
		});
		storageService.setItem("esurl", temp_config.url);
		storageService.setItem("appname", temp_config.appname);
		config = temp_config;
		return temp_config;
	},
	deleteRecord(infoObj, actionOnRecord, removeSelection, resetData, getStreamingTypes) {
		$(".loadingBtn").removeClass("loading");
		$("#close-delete-modal").click();
		$(".close").click();
		infoObj.total -= actionOnRecord.selectedRows.length;
		removeSelection();
		resetData();
		setTimeout(() => {
			getStreamingTypes();
		}, 1000);
		return infoObj;
	},
	getUpdateObj(actionOnRecord, documents) {
		const current_selected_row = actionOnRecord.selectedRows[0];
		const current_row = _.filter(documents, ele => ele._type == current_selected_row._type && ele._id == current_selected_row._id);
		actionOnRecord.row = JSON.stringify(current_row[0].json, null, 4);
		return actionOnRecord;
	},
	watchSelectedRecord(actionOnRecord) {
		actionOnRecord.selectedRows = _.filter(this.state.actionOnRecord.selectedRows, (row) => {
			const flag = subsetESTypes.indexOf(row._type) !== -1;
			return flag;
		});
		return actionOnRecord;
	},
	toggleIt(elementId, checked, visibleColumns, hiddenColumns,) {
		if (!checked) {
			// visible columns - update
			visibleColumns = visibleColumns.filter((v) => {
				if (v != elementId) return v;
			});
			// hidden columns - update
			var flag = hiddenColumns.indexOf(elementId);
			if (flag == -1) {
				hiddenColumns.push(elementId);
			}
		} else {
			// visible columns - update
			var flag = visibleColumns.indexOf(elementId);
			if (flag == -1) {
				visibleColumns.push(elementId);
			}
			// hidden columns - update
			var hiddenColumns = hiddenColumns.filter((v) => {
				if (v != elementId) return v;
			});
		}
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = hiddenColumns;
		createUrl(input_state);
		return {
			visibleColumns,
			hiddenColumns
		};
	},
	removeSort(docs) {
		const sortedArray = help.sortIt(docs, "_type", false);
		if (input_state.hasOwnProperty("sortInfo")) {
			delete input_state.sortInfo;
			createUrl(input_state);
		}
		return {
			documents: sortedArray,
			sortInfo: {
				active: false
			}
		};
	},
	removeFilter(index, externalQueryApplied, filterInfo, applyFilter, resetData, getStreamingData, removeSelection, applyFilterFn) {
		const appliedFilter = filterInfo.appliedFilter;
		appliedFilter.splice(index, 1);
		const obj = {
			active: !!appliedFilter.length,
			applyFilter,
			appliedFilter
		};
		// Remove filterInfo from store
		if (!obj.active) {
			if (input_state.hasOwnProperty("filterInfo")) {
				delete input_state.filterInfo;
				createUrl(input_state);
			}
			if (!externalQueryApplied) {
				sdata = [];
				resetData();
				setTimeout(() => {
					getStreamingData(subsetESTypes);
				}, 500);
			}
			removeSelection();
		} else {
			applyFilterFn(subsetESTypes);
		}
		return {
			filterInfo: obj
		};
	},
	externalQueryPre(query, removeTypes) {
		try {
			query.query = JSON.parse(query.query);
		} catch (e) {}
		try {
			query.type = JSON.parse(query.type);
		} catch (e) {}
		removeTypes();
		$(".full_page_loading").removeClass("hide");
		return {
			extQuery: query.query,
			extType: query.type,
			externalQueryApplied: true
		};
	},
	applyFilter(typeName, columnName, method, value, analyzed, filterInfo) {
		let filterVal;
		if (columnName) {
			filterVal = $.isArray(value) ? value : value.split(",");
			const filterObj = {};
			filterObj.type = typeName;
			filterObj.columnName = columnName;
			filterObj.method = method;
			filterObj.value = filterVal;
			filterObj.active = true;
			filterObj.analyzed = analyzed;
			if (filterInfo.appliedFilter) {
				filterInfo.appliedFilter.push(filterObj);
			} else {
				filterInfo.appliedFilter = [filterObj];
			}
			filterInfo.active = true;
		}
		// Store state of filter
		const filter_state = JSON.parse(JSON.stringify(filterInfo));
		delete filter_state.applyFilter;
		input_state.filterInfo = filter_state;
		createUrl(input_state);
		return {
			filterInfo
		};
	}
};
