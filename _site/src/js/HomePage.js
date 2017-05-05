var React = require('react');
var createReactClass = require('create-react-class');
var DataTable = require('./table/DataTable.js');
var FeatureComponent = require('./features/FeatureComponent.js');
var ShareLink = require('./features/ShareLink.js');
var AppSelect = require('./AppSelect.js');
var Header = require('./Header.js');
var Sidebar = require('./Sidebar.js');
var QueryList = require('./QueryList/index.js');
var PureRenderMixin = require('react-addons-pure-render-mixin');

// This is the file which commands the data update/delete/append.
// Any react component that wishes to modify the data state should
// do so by flowing back the data and calling the `resetData` function
//here. This is sort of like the Darth Vader - Dangerous and
// Commands everything !
//
// ref: https://facebook.github.io/react/docs/two-way-binding-helpers.html

var HomePage = createReactClass({
	displayName: 'HomePage',
	mixins: [PureRenderMixin],

	// The underlying data structure that holds the documents/records
	// is a hashmap with keys as `_id + _type`(refer to keys.js). Its
	// because no two records can have the same _type _id pair, so its
	// easy to check if a record already exists.

	getInitialState: function() {
		return {
			documents: [],
			types: [],
			signalColor: '',
			signalActive: '',
			signalText: '',
			visibleColumns: [],
			hiddenColumns: [],
			sortInfo: {
				active: false
			},
			connect: false,
			filterInfo: {
				active: false,
				applyFilter: this.applyFilter,
				appliedFilter: []
			},
			infoObj: this.resetInfoObj(),
			totalRecord: 0,
			pageLoading: false,
			externalQueryApplied: false,
			externalQueryTotal: 0,
			extQuery: null,
			mappingObj: {},
			actionOnRecord: {
				active: false,
				id: null,
				type: null,
				row: null,
				selectToggle: false,
				selectedRows: [],
				selectRecord: this.selectRecord,
				updateRecord: this.updateRecord,
				deleteRecord: this.deleteRecord,
				removeSelection: this.removeSelection,
				selectToggleChange: this.selectToggleChange,
				getUpdateObj: this.getUpdateObj
			},
			typeInfo: {
				count: 0,
				typeCounter: this.typeCounter
			},
			errorShow: false,
			historicApps: [],
			url: '',
			appname: '',
			splash: true,
			hideUrl: false,
			cleanTypes: false,
			dejavuExportData: null
		};
	},

	resetInfoObj: function() {
		return {
			showing: 0,
			total: 0,
			getOnce: false,
			availableTotal: 0,
			searchTotal: 0,
			userTouchAdd: this.userTouchAdd
		}
	},

	//The record might have nested json objects. They can't be shown
	//as is since it looks cumbersome in the table. What we do in the
	//case of a nested json object is, we replace it with a font-icon
	//(in injectLink) which upon clicking shows a Modal with the json
	//object it contains.

	flatten: function(data, callback) {
		var response = help.flatten(data);
		return callback(response.data, response.fields);
	},

	injectLink: function(data, fields) {
		return data;
	},

	deleteRow: function(index) {
		delete sdata[index];
	},

	//We cannot render a hashmap of documents on the table,
	//hence we convert that to a list of documents every time
	//there is a delete/update/change. This can be more optimised
	//later but it is not that expensive right now, read writes to
	//DOM are much more expensive.

	resetData: function(total, sdata_key) {
		var sortedArray = [];
		var sdata_values = [];
		Object.keys(sdata).forEach((each) => {
			if(!(sdata_key && each === sdata_key)) {
				sdata_values.push(sdata[each]);
			}
		})
		if(sdata_key) {
			sdata_values.unshift(sdata[sdata_key]);
		}

		//if sort is already applied
		if (this.state.sortInfo.active) {
			sortedArray = help.sortIt(sdata_values, this.state.sortInfo.column, this.state.sortInfo.reverse);

		}
		//by default sort it by typename by passing json field
		else if(!sdata_key) {
			sortedArray = help.sortIt(sdata_values, 'json', false);
		} else {
			sortedArray = sdata_values;
		}
		var infoObj = this.state.infoObj;
		infoObj.showing = sortedArray.length;
		if (typeof total != 'undefined' && total !== null) {
			infoObj.searchTotal = total;
		}
		var data = sortedArray;
		var hiddenColumns = this.state.hiddenColumns;
		var visibleColumns = [];
		var availableColumns = [];
		Object.keys(sdata).forEach((each) => {
			Object.keys(sdata[each]).forEach((column) => {
				// if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type') {
				if (column != '_id' && column != '_type') {
					if (visibleColumns.indexOf(column) <= -1 && hiddenColumns.indexOf(column) == -1) {
						visibleColumns.push(column);
					}
				if(availableColumns.indexOf(column) <= -1)
					availableColumns.push(column);
				}
			});
		});

		if(availableColumns.length){
			hiddenColumns.forEach(function(col, key){
				if(availableColumns.indexOf(col) <= -1)
					hiddenColumns.splice(key, 1);
			});
		}

		//set the combined state
		this.setState({
			documents: sortedArray,
			infoObj: infoObj,
			visibleColumns: visibleColumns,
			hiddenColumns: hiddenColumns,
			pageLoading: false
		});

		//set url
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = hiddenColumns;
		createUrl(input_state);
	},

	// Logic to stream continuous data.
	// We call the ``getData()`` function in feed.js
	// which returns a single json document(record).
	updateDataOnView: function(update, total) {
		if (!Array.isArray(update)) {
			update = this.flatten(update, this.injectLink);
			var key = rowKeyGen(update);

			//If the record already exists in sdata, it should
			//either be a delete request or a change to an
			//existing record.
			if (sdata[key]) {
				// If the update has a ``_deleted`` field, apply
				// a 'delete transition' and then delete
				// the record from sdata.
				if (update['_deleted']) {
					for (var each in sdata[key]) {
						var _key = keyGen(sdata[key], each);
						deleteTransition(_key);
					}
					deleteTransition(key);
					this.deleteRow(key);
					setTimeout(function(callback) {
						callback();
					}.bind(null, this.resetData), 1100);
				}

				// If it isn't a delete, we should find a record
				// with the same _type and _id and apply an ``update
				// transition`` and then update the record in sdata.
				//Since sdata is modeled as a hashmap, this is
				//trivial.
				else {
					sdata[key] = update;
					this.resetData();
					for (var each in update) {
						updateTransition(keyGen(update, each));
					}
					var key = rowKeyGen(update);
					updateTransition(key);
				}
			}
			//If its a new record, we add it to sdata and then
			//apply the `new transition`.
			else {
				sdata[key] = update;
				this.resetData(null, key);
				for (var each in update) {
					var _key = keyGen(update, each);
					newTransition(_key);
				}
				var _key = rowKeyGen(update);
				newTransition(_key);
			}
			this.setSampleData(update);
		} else { // when update is an array
			for (var each = 0; each < update.length; each++) {
				update[each] = this.flatten(update[each], this.injectLink);
				var key = rowKeyGen(update[each]);
				if (!sdata[key]) {
					sdata[key] = update[each];
				}
			}
			this.resetData(total);
			this.filterSampleData(update);
		}

		//Set sort from url
		if(decryptedData.sortInfo) {
			this.handleSort(decryptedData.sortInfo.column, null, null, decryptedData.sortInfo.reverse);
		}
	},

	countTotalRecord: function(total, fromStream, method){
		var totalRecord = this.state.totalRecord;
		if(fromStream) {
			if(method == 'index')
				totalRecord += 1;
			else if(method == 'delete')
				totalRecord -= 1;
		}
		else
			totalRecord = total
		return totalRecord;
	},

	countExternalTotalRecord: function(total, fromStream, method){
		var totalRecord = this.state.externalQueryTotal;
		if(fromStream) {
			if(method == 'index')
				totalRecord += 1;
			else if(method == 'delete')
				totalRecord -= 1;
		}
		else
			totalRecord = total
		return totalRecord;
	},

	streamCallback: function(total, fromStream, method) {
		var reacordObj;
		if(this.state.externalQueryApplied) {
			reacordObj = {
				externalQueryTotal: this.countExternalTotalRecord(total, fromStream, method)
			};
			feed.externalQueryTotal = reacordObj.externalQueryTotal;
		} else {
			reacordObj = {
				totalRecord: this.countTotalRecord(total, fromStream, method)
			};
		}
		this.setState(reacordObj);
	},

	onEmptySelection: function() {
		OperationFlag = false;
		var infoObj = this.state.infoObj;
		infoObj.showing = 0;
		var totalRecord = 0;
		sdata = {};
		this.setState({
			infoObj: infoObj,
			totalRecord: totalRecord,
			documents: sdata
		});
	},

	getStreamingData: function(types) {
		if(!queryParams.query) {
			startGet.call(this);
		}
		function startGet() {
			if (!OperationFlag) {
				OperationFlag = true;

				//If filter is applied apply filter data
				if(this.state.externalQueryApplied && this.state.extQuery) {
					// this.externalQuery({
					// 	query: this.state.extQuery,
					// 	type: this.state.extType,
					// });
				}
				else if (this.state.filterInfo.active) {
					// var filterInfo = this.state.filterInfo;
					// debugger
					// filterInfo.appliedFilter.forEach(function(filterItem) {
					// 	this.applyFilter(types, filterItem.columnName, filterItem.method, filterItem.value, filterItem.analyzed);
					// }.bind(this));
					this.applyFilter(types);
				}
				//Get the data without filter
				else {
					if (types.length) {
						const d1 = new Date();
						feed.getData(types, function(update, fromStream, total) {
							if(subsetESTypes.length)
								this.updateDataOnView(update, total);
							else
								this.updateDataOnView([],0);
						}.bind(this), function(total, fromStream, method) {
							this.streamCallback(total, fromStream, method);
						}.bind(this));
					} else {
						this.onEmptySelection();
					}
				}
			} else {
				setTimeout(function(){ this.getStreamingData(types) }.bind(this), 300);
			}
		}
	},

	// get query body
	getQueryBody: function() {
		var filterInfo = this.state.filterInfo;
		var queryBody = null;
		if(this.state.externalQueryApplied) {
			queryBody = feed.externalQueryBody;
		}
		else if (filterInfo.active) {
			queryBody = this.generateFilterQuery(filterInfo.appliedFilter);
		}
		return queryBody;
	},

	// get type
	getSelectedTypes: function() {
		var filterInfo = this.state.filterInfo;
		var selectedTypes = subsetESTypes;
		if(this.state.externalQueryApplied) {
			selectedTypes = feed.externalQueryType;
		}
		return selectedTypes;
	},

	// infinite scroll implementation
	paginateData: function() {
		feed.paginateData(this.state.infoObj.total, function(update) {
			this.updateDataOnView(update);
		}.bind(this), this.getQueryBody(), this.getSelectedTypes());
	},

	// only called on change in types.
	getStreamingTypes: function() {
		if (typeof APPNAME == 'undefined' || APPNAME == null) {
			setTimeout(this.getTotalRecord, 1000);
		} else {
			feed.getTypes(function(update) {
				update = update.sort(function(a, b) {
					return a.toLowerCase().localeCompare(b.toLowerCase());
				});
				subsetESTypes.forEach(function(type) {
					if(update.indexOf(type) === -1) {
						this.unwatchStock(type);
					}
				}.bind(this));
				// if(BRANCH !== 'chrome') {
				//     this.setState({
				//         types: update,
				//         connect: true
				//     });
				// } else {
					this.setChromeTypes(update);
				// }
			}.bind(this));
		}
	},

	// only for chrome branch
	setChromeTypes: function(update) {
		var typeCheck = {};
		storageService.getItem('types', function (result) {
				var types = result.types;
				var value = false;
				try {
					types = JSON.parse(types);
					update.forEach(function(v){
						var value = types.indexOf(v) !== -1 ? true : false;
						typeCheck[v] = value;
					});
				} catch(e) {
					update.forEach(function(v){
						var value = false;
					});
				}
			});
		update.forEach(function(v){
			storageService.getItem(v, function (result) {
				var value = result[v];
				value = value == 'undefined' || typeof value == 'undefined' ? false : value;
				typeCheck[v] = value;
			});
		});
		setTimeout(function(){
			$('.full_page_loading').addClass('hide');
			this.setState({
				types: update,
				typeCheck: typeCheck,
				connect: true
			}, function() {
				mirageLink(function() {});
			});
		}.bind(this),1000);
	},

	removeType: function(typeName) {
		feed.deleteData(typeName, function(data) {
			this.resetData();
		}.bind(this));
	},

	componentWillMount: function() {
		this.apply_other();
		if(BRANCH === 'appbase') {
			this.setState({
				splash: false
			});
		} else {
			if(window.location.href.indexOf('#?input_state') !== -1 || window.location.href.indexOf('?default=true') !== -1) {
				this.setState({
					splash: false
				});
				if(window.location.href.indexOf('?default=true') > -1) {
					this.connectSync(config);
				} else {
					config = {};
					getUrl(this.connectSync);
				}
			}
		}
	},

	componentDidMount: function() {
		this.setApps();
	},

	connectSync: function(config_in) {
		config = config_in;
		var self = this;
		this.afterConnect();
		input_state = JSON.parse(JSON.stringify(config_in));
		createUrl(input_state);
		getMapFlag = false;
		$('.full_page_loading').removeClass('hide');
		esTypes = [];
		subsetESTypes = [];
		beforeInit();
		self.setState({
			splash: false,
			types: [],
			documents: [],
			totalRecord: 0,
			connect: false
		});
		setTimeout(function(){
			appAuth = true;
			self.init_map_stream();
		},500);
	},

	init_map_stream: function() {
		try {
			clearInterval(this.mappingInterval);
			clearInterval(streamingInterval);
		}
		catch (e) {}
		
		// this.setMap();
		if(appAuth) {
			setTimeout(this.setMap, 2000)
			setTimeout(this.getStreamingTypes, 2000);
			// call every 1 min.
			this.mappingInterval = setInterval(this.setMap, 60 * 1000);
			streamingInterval = setInterval(this.getStreamingTypes, 60 * 1000);
			this.getTotalRecord();
		}
	},

	apply_other: function() {
		if(typeof BRANCH !== 'undefined' && BRANCH === 'master') {
			this.setIndices();
		}
	},

	// BRANCH: MASTER
	setIndices: function() {
		var es_host = document.URL.split('/_plugin/')[0];
		var getIndices = feed.getIndices(es_host);
		if(getIndices) {
			getIndices.then(function (data) {
				this.getApps(getAppsCb.bind(this));
				function getAppsCb(res) {
					var historicApps = res.historicApps;
					if(historicApps) {
						try {
							historicApps = JSON.parse(apps);
						} catch(e) {
							historicApps = [];
						}
					} else {
						historicApps = [];
					}
					var indices = [];
					for(indice in data.indices) {
						if(historicApps && historicApps.length) {
							historicApps.forEach(function(old_app, index) {
								if(old_app.appname === indice) {
									historicApps.splice(index, 1);
								}
							})
						}
						var obj = {
							appname: indice,
							url: es_host
						};
						indices.push(indice);
						historicApps.push(obj);
					}
					// default app is no app found
					if(!historicApps.length) {
						var obj = {
							appname: 'sampleapp',
							url: es_host
						};
						historicApps.push(obj);
					}
					this.setState({
						historicApps: historicApps,
						url: es_host,
						es_host: es_host,
						indices: indices
					});
					storageService.setItem('historicApps', JSON.stringify(historicApps));
				};
			}.bind(this));
		}
	},

	appnameCb: function(appname) {
		if(this.state.indices) {
			var app_match = this.state.indices.filter(function(indice) {
				return indice ===  appname;
			});
			var app_match_flag = app_match.length ? true : false;
			var show_index_info = this.state.url === this.state.es_host ? true : false; 
			this.setState({
				app_match_flag: app_match_flag,
				current_appname: appname,
				show_index_info: show_index_info
			});
		}
	},

	afterConnect: function() {
		if(appAuth) {
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

			setTimeout(this.setMap, 2000)
			setTimeout(this.getStreamingTypes, 2000);
			// call every 1 min.
			this.mappingInterval = setInterval(this.setMap, 60 * 1000);
			streamingInterval = setInterval(this.getStreamingTypes, 60 * 1000);
			this.getTotalRecord();

			this.setState({
				url: config.url
			});
		}
	},

	componentDidUpdate: function() {
		var hiddenColumns = this.state.hiddenColumns;
		this.hideAttribute(hiddenColumns, 'hide');
	},

	removeHidden: function() {
		var hiddenColumns = this.state.hiddenColumns;
		this.hideAttribute(hiddenColumns, 'show');
		var visibleColumns = this.state.visibleColumns.concat(hiddenColumns);

		this.setState({
			hiddenColumns: [],
			visibleColumns: visibleColumns
		});

		//set url
		input_state.visibleColumns = visibleColumns;
		input_state.hiddenColumns = [];
		createUrl(input_state);
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

	unwatchStock: function(typeName) {
		//Remove sorting while unslecting type
		this.setState({
			sortInfo: {
				active: false
			}
		});

		//Remove sortInfo from store
		if(input_state.hasOwnProperty('sortInfo')) {
			delete input_state.sortInfo;
			createUrl(input_state);
		}
		subsetESTypes.splice(subsetESTypes.indexOf(typeName), 1);
		this.removeType(typeName);
		input_state.selectedType = subsetESTypes;
		createUrl(input_state);
		this.watchSelectedRecord();
		this.applyGetStream();
	},

	removeTypes: function() {
		subsetESTypes.forEach(function(typeName) {
			this.removeType(typeName);
		}.bind(this));
		subsetESTypes = [];
		input_state.selectedType = subsetESTypes;
		createUrl(input_state);
		this.watchSelectedRecord();
		this.applyGetStream();
		window.storageService.setItem('types', JSON.stringify(subsetESTypes));
		this.setState({
			sortInfo: {
				active: false
			},
			cleanTypes: true
		});
	},

	typeCounter: function() {
		var typeInfo = this.state.typeInfo;
		typeInfo.count++;
		this.setState({
			typeInfo: typeInfo
		});
		this.applyGetStream();
	},

	applyGetStream: function() {
		var typeInfo = this.state.typeInfo;
		if (typeInfo.count >= this.state.types.length) {
			this.getStreamingData(subsetESTypes);
		}
	},

	setMap: function() {
		var $this = this;
		if (APPNAME && !$('.modal-backdrop').hasClass('in')) {
			var getMappingObj = feed.getMapping();
			getMappingObj.done(function(data) {
				const mappingObjData = data;
				if(!getMapFlag) {
					$this.setApps(true);
					getMapFlag = true;
				}
				$this.setState({
					mappingObj: mappingObjData[APPNAME]['mappings']
				});
			}).error(function(xhr){
				if(xhr.status == 401){
					$this.setState({
						errorShow: true
					});
					appAuth = false;
					clearInterval(this.mappingInterval);
					clearInterval(streamingInterval);
				}
			});
		}
	},

	handleScroll: function(event) {
		var scroller = document.getElementById('table-scroller');
		var infoObj = this.state.infoObj;
		// Plug in a handler which takes care of infinite scrolling
		if ((subsetESTypes.length || this.state.externalQueryApplied) && infoObj.showing < infoObj.searchTotal && scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight - 100 && !this.state.pageLoading) {
				this.setState({
					pageLoading: true
				});
				this.paginateData();
		}
	},

	handleSort: function(item, type, eve, order) {
		if(!order) {
			order = help.getOrder(item);
		}
		var storObj = {
			active: true,
			column: item,
			reverse: order
		};
		this.setState({
			sortInfo: storObj
		});

		//Store state of sort
		if(decryptedData.sortInfo)
			delete decryptedData.sortInfo;
		var sort_state = JSON.parse(JSON.stringify(storObj));
		input_state.sortInfo = sort_state;
		createUrl(input_state);

		var docs = this.state.documents;
		var sortedArray = help.sortIt(docs, item, order);
		this.setState({
			documents: sortedArray
		});
	},

	addRecord: function(editorref) {
		var form = $('#addObjectForm').serializeArray();
		var indexData = help.normalizeIndexData(editorref.getValue().trim());
		if(indexData.method) {
			form.push(indexData.data);
			this.indexCall(form, 'close-modal', indexData.method);
		}
	},

	updateRecord: function(editorref) {
		var form = $('#updateObjectForm').serializeArray();
		var indexData = JSON.parse(editorref.getValue().trim());
		var obj = {
			name: 'body',
			value: indexData
		};
		form.push(obj);
		var recordObject = {};
		this.indexCall(form, 'close-update-modal', 'update');
	},

	indexCall: function(form, modalId, method) {
		var recordObject = {};
		$.each(form, function(k2, v2) {
			if (v2.value != '')
				recordObject[v2.name] = v2.value;
		});
		feed.indexData(recordObject, method, function(res, newTypes) {
			if(method === 'bulk' && res && res.items && res.items.length) {
				this.reloadData();
				if(!res.errors) {
					toastr.success(res.items.length+' records have been successfully indexed.');
				} else {
					toastr.error('Your data hasn’t been added, likely cause is a mapper parsing exception.');
				}
			}
			$('.close').click();
			this.getStreamingTypes();
			if (typeof newTypes != 'undefined') {
				this.setState({
					types: newTypes
				});
				setTimeout(function(){
					this.setMap();
				}.bind(this),500);
			}
		}.bind(this));
		setTimeout(function() {
			$('.close').click();
			this.getStreamingTypes();
		}.bind(this), 2000);
	},

	getTypeDoc: function(editorref) {
		var selectedTypes = $('#setType').val();
		var selectedType;
		if(selectedTypes && selectedTypes.length) {
			selectedType = selectedTypes[0];
		}
		var typeDocSample = this.state.typeDocSample;
		var $this = this;
		if (selectedType != '' && selectedType != null && typeDocSample && typeDocSample.hasOwnProperty(selectedType)) {
			if (typeDocSample.hasOwnProperty(selectedType)) {
				feed.getSingleDoc(selectedType, function(data) {
					try {
						typeDocSample[selectedType] = data.hits.hits[0]._source;
						$this.setState({
							typeDocSample: typeDocSample
						});
						$this.showSample(typeDocSample[selectedType], editorref);
					}
					catch (err) {
						console.log(err);
					}
				});
			} else this.showSample(typeDocSample[selectedType], editorref);
		}
	},

	userTouchFlag: false,

	//If user didn't touch to textarea only then show the json
	showSample: function(obj, editorref) {
		if(this.userTouchFlag && editorref.getValue().trim() != ''){}
		else{
			var convertJson = obj.hasOwnProperty('json') ? obj.json : obj;
			var objJson = JSON.stringify(convertJson, null, 2);
			editorref.setValue(objJson);
		}
	},

	filterSampleData: function(data) {
		var filteredType = [];
		data.filter(function(record, index) {
			if(filteredType.indexOf(record['_type']) < 0) {
				filteredType.push(record['_type']);
				this.setSampleData(record);
			}
		}.bind(this));
	},

	setSampleData: function(update) {
		if(typeof update != 'undefined') {
			var typeDocSample = this.state.typeDocSample ? this.state.typeDocSample : {};
			typeDocSample[update['_type']] = $.extend({}, update);
			delete typeDocSample[update['_type']]._id;
			delete typeDocSample[update['_type']]._type;
			this.setState({
				typeDocSample: typeDocSample
			});
		}
	},

	//Get the form data in help exportData,
	//Do the test query before exporting data
	exportData: function() {
		var exportObject = help.exportData();
		var $this = this;
		exportObject.query = this.getQueryBody();
		var testQuery = feed.testQuery(exportObject.type, exportObject.query);
		testQuery.on('data', function(res) {
			if (!res.hasOwnProperty('error'))
				$this.exportQuery(exportObject);
			else {
				toastr.error(res.error, 'ES Error : ' + res.status, {
					timeOut: 5000
				})
				$('#exportBtn').removeClass('loading').removeAttr('disabled');
			}

		}).on('error', function(err) {
			toastr.error(err, 'ES Error', {
				timeOut: 5000
			})
			$('#exportBtn').removeClass('loading').removeAttr('disabled');
		});
	},

	exportQuery: function(exportObject) {
		var url = 'https://accapi.appbase.io/app/' + APPID + '/export';

		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(exportObject),
			contentType: "application/text",
			datatype: 'json',
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				$('#exportBtn').removeClass('loading').removeAttr('disabled');
				$('#close-export-modal').click();
				$('.close').click();
				toastr.success('Data is exported, please check your email : ' + PROFILE.email + '.');
			}
		});
	},

	applyFilter: function(typeName, columnName, method, value, analyzed) {
		var $this = this;
		var filterInfo = this.state.filterInfo;
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
			this.setState({
				filterInfo: filterInfo
			});
		}
		//Store state of filter
		var filter_state = JSON.parse(JSON.stringify(filterInfo));
		delete filter_state.applyFilter;
		input_state.filterInfo = filter_state;
		createUrl(input_state);
		// method, columnName, filterVal, subsetESTypes, analyzed
		if (typeName != '' && typeName != null) {
			feed.filterQuery(filterInfo.appliedFilter, subsetESTypes, function(update, fromStream, total) {
				if (!fromStream) {
					sdata = [];
					$this.resetData(total);
				}
				setTimeout(function() {
					if (update != null)
						$this.updateDataOnView(update);
				}, 500);
			}.bind(this), function(total, fromStream, method) {
				this.streamCallback(total, fromStream, method);
			}.bind(this));
		} else {
			this.onEmptySelection();
		}
		this.removeSelection();
	},

	externalQuery: function(query) {
		var $this = this;
		try {
			query.query = JSON.parse(query.query);
		} catch(e) {}
		try {
			query.type = JSON.parse(query.type);
		} catch(e) {}
		this.removeTypes();
		this.setState({
			extQuery: query.query,
			extType: query.type,
			externalQueryApplied: true
		}, this.removeFilter);
		$('.full_page_loading').removeClass('hide');
		feed.externalQuery(query.query, query.type , function(update, fromStream, total) {
			if (!fromStream) {
				sdata = [];
				$this.setState({
					externalQueryTotal: total
				});
				$this.resetData(total);
			}
			setTimeout(function() {
				if (update != null)
					$this.updateDataOnView(update);
					$('.full_page_loading').addClass('hide');
			}, 500);
		}.bind(this), function(total, fromStream, method) {
			this.streamCallback(total, fromStream, method);
		}.bind(this));
	},

	removeExternalQuery: function(cb) {
		if(this.state.externalQueryApplied) {
			feed.removeExternalQuery();
			this.setState({
				externalQueryApplied: false
			}, function() {
				this.removeFilter();
				if(cb) {
					cb();
				}
			}.bind(this));
		}
	},

	removeFilter: function(index) {
		var $this = this;
		var appliedFilter = this.state.filterInfo.appliedFilter;
		appliedFilter.splice(index, 1);
		var obj = {
			active: appliedFilter.length ? true : false,
			applyFilter: this.applyFilter,
			appliedFilter: appliedFilter
		};
		this.setState({
			filterInfo: obj
		});

		//Remove filterInfo from store
		if(!obj.active) {
			if(input_state.hasOwnProperty('filterInfo')) {
				delete input_state.filterInfo;
				createUrl(input_state);
			}
			if(!$this.state.externalQueryApplied) {
				sdata = [];
				$this.resetData();
				setTimeout(function() {
					$this.getStreamingData(subsetESTypes);
				}, 500);
			}
			this.removeSelection();
		} else {
			this.applyFilter(subsetESTypes);
		}
	},

	removeSort: function() {
		var docs = this.state.documents;
		var sortedArray = help.sortIt(docs, '_type', false);
		this.setState({
			documents: sortedArray
		});
		this.setState({
			sortInfo: {
				active: false
			}
		});
		//Remove sortInfo from store
		if(input_state.hasOwnProperty('sortInfo')) {
			delete input_state.sortInfo;
			createUrl(input_state);
		}
	},

	columnToggle: function() {
		var $this = this;
		var obj = {
			toggleIt: function(elementId, checked) {
				if (!checked) {
					//visible columns - update
					var visibleColumns = $this.state.visibleColumns.filter(function(v){
						if (v != elementId) return v;
					});

					//hidden columns - update
					hiddenColumns = $this.state.hiddenColumns;
					var flag = hiddenColumns.indexOf(elementId);
					if (flag == -1) {
						hiddenColumns.push(elementId);
					}
				} else {
					//visible columns - update
					visibleColumns = $this.state.visibleColumns;
					var flag = visibleColumns.indexOf(elementId);
					if (flag == -1) {
						visibleColumns.push(elementId);
					}

					//hidden columns - update
					var hiddenColumns = $this.state.hiddenColumns.filter(function(v){
						if (v != elementId) return v;
					});
				}

				$this.setState({
					visibleColumns: visibleColumns,
					hiddenColumns: hiddenColumns
				});

				//set url
				input_state.visibleColumns = visibleColumns;
				input_state.hiddenColumns = hiddenColumns;
				createUrl(input_state);
			},
			setVisibleColumn: function() {

			}
		};
		return obj;
	},

	selectRecord: function(id, type, row, currentCheck) {
		var selection = help.selectRecord(this.state.actionOnRecord, id, type, row, currentCheck, this.state.documents);
		this.setState({
			actionOnRecord: selection.actionOnRecord
		});
		this.forceUpdate();
	},

	removeSelection: function() {
		var selection = help.removeSelection(this.state.actionOnRecord, this.state.documents);
		selection.actionOnRecord.selectToggle = false;
		this.setState({
			actionOnRecord: selection.actionOnRecord
		});
		this.forceUpdate();
		$('[name="selectRecord"]').removeAttr('checked');
	},

	watchSelectedRecord: function() {
		var actionOnRecord = this.state.actionOnRecord;
		actionOnRecord.selectedRows = _.filter(this.state.actionOnRecord.selectedRows, function(row) {
			var flag = subsetESTypes.indexOf(row._type) === -1 ? false : true;
			return flag;
		});
		if(!actionOnRecord.selectedRows.length) {
			this.removeSelection();
		}
		else {
			this.setState({
				actionOnRecord: actionOnRecord
			});
			this.forceUpdate();
		}
	},

	selectToggleChange: function(checkbox) {
		var actionOnRecord = help.selectAll(checkbox, this.state.actionOnRecord, this.state.documents);
		actionOnRecord.selectToggle = checkbox;
		this.setState({
			actionOnRecord: actionOnRecord
		});
		this.forceUpdate();
	},

	getUpdateObj: function() {
		var actionOnRecord = this.state.actionOnRecord;
		var current_selected_row = actionOnRecord.selectedRows[0];
		var current_row = _.filter(this.state.documents, function(ele) {
			return ele._type == current_selected_row._type && ele._id == current_selected_row._id;
		});
		actionOnRecord.row = JSON.stringify(current_row[0].json, null, 4);
		this.setState({
			actionOnRecord: actionOnRecord
		});
	},

	deleteRecord: function() {
		$('.loadingBtn').addClass('loading');
		feed.deleteRecord(this.state.actionOnRecord.selectedRows, function(update) {
			$('.loadingBtn').removeClass('loading');
			$('#close-delete-modal').click();
			$('.close').click();
			var infoObj = this.state.infoObj;
			infoObj.total -= this.state.actionOnRecord.selectedRows.length;

			this.setState({
				infoObj: infoObj
			});

			this.removeSelection();
			this.resetData();
			setTimeout(function() {
				this.getStreamingTypes();
			}.bind(this), 1000);
		}.bind(this));
	},

	initEs:function(){
		var self = this;
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

		if(typeof BRANCH != 'undefined'  && BRANCH === 'master') {
			checkIndex();
		} else {
			letsConnect();
		}

		// BRANCH: MASTER
		// check if index exists or not, and create index if not exists
		function checkIndex() {
			feed.checkIndex(temp_config.url, temp_config.appname).done(function(data) {
				console.log(data);
				letsConnect();
			}).error(function(xhr){
				if(xhr.status === 404){
					feed.createIndex(temp_config.url, temp_config.appname).done(function(data) {
						letsConnect();
					});
				} else {
					letsConnect();
				}
			});
		}
		function letsConnect() {
			storageService.setItem('esurl',temp_config.url);
			storageService.setItem('appname',temp_config.appname);
			config = temp_config;
			if(BRANCH !== 'chrome') {
				createUrl(temp_config, function() {
					self.connectSync(temp_config);
				});
			} else {
				config = temp_config;
				setTimeout(function(){
					getMapFlag = false;
					$('.full_page_loading').removeClass('hide');
					esTypes = [];
					subsetESTypes = [];
					self.setState({
						splash: false,
						types: [],
						documents: [],
						totalRecord: 0,
						connect: false
					});
					beforeInit();
					setTimeout(function(){
						appAuth = true;
						self.init_map_stream();
					},500);
				},1000);
			}
		}
	},

	connectPlayPause: function() {
		var reloadFlag = true;
		var formInfo = $('#init-ES').serializeArray();
		formInfo.forEach(function(v) {
			if(v.value.trim() === '') {
				reloadFlag = false;
			}
		});
		if(!reloadFlag) {
			alert('Url or appname should not be empty.');
		} else {
			var connectToggle = this.state.connect ? false: true;
			window.location.href = "#?input_state=''";
			if(connectToggle) {
				this.initEs();
			}
			else {
				subsetESTypes = [];
				this.setState({
					connect: connectToggle,
					documents: [],
					types: [],
					infoObj: this.resetInfoObj()
				});
			}
		}
	},

	reloadData: function(){
		this.getStreamingData(subsetESTypes);
	},

	userTouchAdd: function(flag){
		this.userTouchFlag = flag;
	},

	closeErrorModal: function(){
		this.setState({
			errorShow: false
		});
	},

	exportJsonData: function() {
		$('.json-spinner').show();
		this.setState({
			dejavuExportData: null
		});
		var defaultQuery = {
			"query": {
				"match_all": {}
			},
			"size":1000
		};
		var activeQuery = this.getQueryBody() ? this.getQueryBody() : defaultQuery;
		this.scrollApi({"activeQuery": activeQuery});
	},

	scrollApi: function(info) {
		feed.scrollapi(this.getSelectedTypes(), info.activeQuery, info.scroll, info.scroll_id).done(function(data){
			var hits = data.hits.hits;
			exportJsonData = exportJsonData.concat(hits);
			if(hits.length > 999) {
				var scrollObj = {
					'scroll': '1m',
					'scroll_id': data._scroll_id
				};
				this.scrollApi({"activeQuery": scrollObj, "scroll": true, "scroll_id": data._scroll_id});
			}
			else {
				var str = JSON.stringify(exportJsonData, null, 4);
				this.setState({
					dejavuExportData: str
				});
				$('.json-spinner').hide();
				exportJsonData = [];
			}
		}.bind(this));
	},

	getApps: function(cb) {
		var apps = storageService.getItem('historicApps');
		cb({historicApps: apps});
	},

	setApps: function(authFlag) {
		var self = this;
		if(BRANCH !== 'chrome') {
			this.getApps(getAppsCb);
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
			self.setState({
				historicApps: historicApps
			});
			storageService.setItem('historicApps', JSON.stringify(historicApps));
		};
	},

	setConfig: function(url) {
		this.setState({ url: url});
		this.setState({
			connect: false
		});
	},

	valChange: function(event) {
		this.setState({ url: event.target.value});
	},

	hideUrlChange: function() {
		var hideUrl = this.state.hideUrl ? false : true;
		this.setState({
			hideUrl: hideUrl
		});
	},

	composeQuery: function() {
		mirageLink(function(error, link) {
			if(link) {
				window.open(link, '_blank');
			} else {
				console.log(error);
			}
		});
	},

	//The homepage is built on two children components(which may
	//have other children components). TypeTable renders the
	//streaming types and DataTable renders the streaming documents.
	//main.js ties them together.

	render: function() {
		var self = this;
		var EsForm = !this.state.splash ? 'col-xs-12 init-ES': 'col-xs-12 EsBigForm';
		var esText = !this.state.splash ? (this.state.connect ? 'Disconnect':'Connect'): 'Start Browsing';
		var esBtn = this.state.connect ? 'btn-primary ': '';
		esBtn += 'btn btn-default submit-btn';
		var shareBtn = this.state.connect ? 'share-btn': 'hide';
		var url = this.state.url;
		var opts = {};
		var playClass = 'ib fa fa-play';
		var pauseClass = 'hide fa fa-pause';
		if(this.state.connect) {
			opts['readOnly'] = 'readOnly';
			playClass = 'hide fa fa-play';
			pauseClass = 'ib fa fa-pause';
		}
		var hideEye = {'display': this.state.splash ? 'none': 'block'};
		var hideUrl = this.state.hideUrl ? 'hide-url expand' : 'hide-url collapse';
		var hideUrlText = this.state.hideUrl ? React.createElement('span', {className: 'fa fa-eye-slash'}, null): React.createElement('span', {className: 'fa fa-eye'}, null);
		var index_create_text = (<div className="index-create-info col-xs-12"></div>);
		if(BRANCH === 'master' && this.state.show_index_info && this.state.current_appname.length && !this.state.app_match_flag) {
			index_create_text = (<p className="danger-text"> A new index '{this.state.current_appname}' will be created.</p>);
		}
		var githubStar = (<iframe src="https://ghbtns.com/github-btn.html?user=appbaseio&repo=dejavu&type=star&count=true" frameBorder="0" scrolling="0" width="120px" height="20px"></iframe>);
		if(BRANCH === 'chrome') {
			githubStar = (<a href="https://github.com/appbaseio/dejavu" target="_blank">
							<img src="buttons/appbaseio-dejavu.png" alt="Dejavu"/>
						</a>);
		}
		var composeQuery;
		if(this.state.connect) {
			composeQuery = (<a target="_blank" href="https://appbaseio.github.io/mirage/" className="mirage_link btn btn-default"> 
								 Query View <i className="fa fa-external-link-square"></i>
								</a>);
		}
		function initialForm() {
			var form = null;
			if(BRANCH !== 'appbase') {
				form = (
				<form className={EsForm} id="init-ES">
					<div className="vertical0">
						<div className="vertical1">
							<div className="esContainer">
								<div className="img-container">
									<img src="assets/img/icon.png" />
								</div>
								<div>
								  <h1>Déjà vu</h1>
								  <h4 className="dejavu-bottomline">The Missing Web UI for Elasticsearch</h4>
								  {index_create_text}
								</div>
								<ShareLink btn={shareBtn}> </ShareLink>
								{composeQuery}
								<div className="splashIn">
									<div className="form-group m-0 col-xs-4 pd-0 pr-5">
										<AppSelect 
											connect={self.state.connect} 
											splash={self.state.splash} 
											setConfig={self.setConfig} 
											apps={self.state.historicApps} 
											appnameCb={self.appnameCb} />
									</div>
									<div className="col-xs-8 m-0 pd-0 pr-5 form-group">
										<div className="url-container">
											<input type="text" className="form-control" name="url" placeholder="URL for cluster goes here. e.g.  https://username:password@scalr.api.appbase.io"
												value={url}
												onChange={self.valChange}  {...opts} />
											<span className={hideUrl} style={hideEye}>
												<a className="btn btn-default"
													onClick={self.hideUrlChange}>
													{hideUrlText}
												</a>
											</span>
										</div>
									</div>
								</div>
								<div className="submit-btn-container">
									<a className={esBtn} onClick={self.connectPlayPause}>
										<i className={playClass}></i>
										<i className={pauseClass}></i>
										{esText}
									</a>
									{
										this.state && this.state.splash ? (
											<a className="btn btn-default m-l10" href="./importer/index.html">
												Import JSON or CSV files
											</a>
										) : null
									}
								</div>
							</div>
						</div>
					</div>
				</form>);
			}
			return form;
		}
		var footer;
		queryParams = getQueryParameters();
		if(!((queryParams && queryParams.hasOwnProperty('hf')) || (queryParams && queryParams.hasOwnProperty('f')))) {
			footer = (
				<footer className="text-center">
					<a href="http://appbaseio.github.io/dejavu">Watch Video</a>
					<span className="text-right pull-right powered_by">
						Create your <strong>Elasticsearch</strong> in cloud with&nbsp;<a href="http://appbase.io">appbase.io</a>
					</span>
					<span className="pull-left github-star">
						{githubStar}
					</span>
				</footer>
			);
		}
		if(!((queryParams && queryParams.hasOwnProperty('hf')) || (queryParams && queryParams.hasOwnProperty('h')))) {
			var dejavuForm = initialForm.call(this);
		}
		var containerClass = 'row dejavuContainer '+BRANCH+ (queryParams && queryParams.hasOwnProperty('hf') ? ' without-hf ' : '') + (queryParams && queryParams.hasOwnProperty('h') ? ' without-h ' : '') + (queryParams && queryParams.hasOwnProperty('f') ? ' without-f ' : '') + (queryParams && queryParams.hasOwnProperty('sidebar') ? ' without-sidebar ' : '') + (this.state.splash ? ' splash-on ' : '');
		return (<div>
					<div id='modal' />
					<div className={containerClass}>
						<div className="appHeaderContainer">
						<Header />
							<div className="appFormContainer">
								{dejavuForm}
								<div className="typeContainer">
								<Sidebar
										typeProps={{
											Types:this.state.types,
											watchTypeHandler:this.watchStock,
											unwatchTypeHandler:this.unwatchStock,
											ExportData:this.exportData,
											signalColor:this.state.signalColor,
											signalActive:this.state.signalActive,
											signalText:this.state.signalText,
											typeInfo:this.state.typeInfo,
											selectedTypes: subsetESTypes,
											cleanTypes: this.state.cleanTypes,
											connect: this.state.connect
										}}
										queryProps={{
											'externalQuery':this.externalQuery,
											'externalQueryApplied': this.state.externalQueryApplied,
											'removeExternalQuery':this.removeExternalQuery,
											'types': this.state.types
										}}
									/>
								</div>
								<div className="col-xs-12 dataContainer">
									<DataTable
										_data={this.state.documents}
										sortInfo={this.state.sortInfo}
										filterInfo={this.state.filterInfo}
										infoObj={this.state.infoObj}
										totalRecord={this.state.totalRecord}
										scrollFunction={this.handleScroll}
										selectedTypes={subsetESTypes}
										handleSort={this.handleSort}
										mappingObj={this.state.mappingObj}
										removeFilter ={this.removeFilter}
										addRecord = {this.addRecord}
										getTypeDoc={this.getTypeDoc}
										Types={this.state.types}
										removeSort = {this.removeSort}
										removeHidden = {this.removeHidden}
										removeTypes = {this.removeTypes}
										visibleColumns = {this.state.visibleColumns}
										hiddenColumns = {this.state.hiddenColumns}
										columnToggle ={this.columnToggle}
										actionOnRecord = {this.state.actionOnRecord}
										pageLoading={this.state.pageLoading}
										reloadData={this.reloadData}
										exportJsonData= {this.exportJsonData}
										externalQueryApplied={this.state.externalQueryApplied}
										externalQueryTotal={this.state.externalQueryTotal} 
										removeExternalQuery={this.removeExternalQuery}
										dejavuExportData={this.state.dejavuExportData}
									/>
								</div>
								{footer}
								<FeatureComponent.ErrorModal
									errorShow={this.state.errorShow}
									closeErrorModal = {this.closeErrorModal}>
								</FeatureComponent.ErrorModal>
								<div className="full_page_loading hide">
									<div className="loadingBar"></div>
									<div className="vertical1">
									</div> 
								</div>
							</div>
						</div>
					</div>
				</div>);
	},
});

module.exports = HomePage;
