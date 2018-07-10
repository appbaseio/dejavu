import get from 'lodash/get';

var React = require('react');
var createReactClass = require('create-react-class');
var DataTable = require('./table/DataTable.js');
var FeatureComponent = require('./features/FeatureComponent.js');
var Header = require('./Header.js');
var Sidebar = require('./Sidebar.js');
var QueryList = require('./QueryList/index.js');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SharedComponents = require('./helper/SharedComponents');

var HomePage = createReactClass({
	displayName: 'HomePage',
	mixins: [PureRenderMixin],
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
			infoObj: help.resetInfoObj(this.userTouchAdd),
			totalRecord: 0,
			pageLoading: false,
			loadingSpinner: false,
			isLoadingData: false,
			externalQueryApplied: false,
			externalQueryTotal: 0,
			extQuery: null,
			mappingObj: {},
			settingsObj: {},
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
			errorMessage: '',
			historicApps: [],
			url: '',
			appname: '',
			splash: true,
			hideUrl: false,
			cleanTypes: false,
			dejavuExportData: null,
			showFetchIndex: false
		};
	},
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
	resetData: function(total, sdata_key) {
		this.setState(help.resetData(total, sdata_key, this.state.sortInfo, this.state.infoObj, this.state.hiddenColumns, this.state.types, this.state.mappingObj));
	},
	// Logic to stream continuous data.
	// We call the ``getData()`` function in feed.js
	// which returns a single json document(record).
	updateDataOnView: function(update, total) {
		if (update && !Array.isArray(update)) {
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
		} else if (Array.isArray(update)) { // when update is an array
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

		// Set sort from url
		if (decryptedData.sortInfo) {
			this.handleSort(decryptedData.sortInfo.column, decryptedData.sortInfo.type, null, decryptedData.sortInfo.reverse);
		}
	},
	streamCallback: function(total, fromStream, method) {
		var reacordObj;
		if(this.state.externalQueryApplied) {
			reacordObj = {
				externalQueryTotal: help.countExternalTotalRecord(total, fromStream, method, this.state.totalRecord)
			};
			feed.externalQueryTotal = reacordObj.externalQueryTotal;
		} else {
			reacordObj = {
				totalRecord: help.countTotalRecord(total, fromStream, method, this.state.totalRecord)
			};
		}
		this.setState(reacordObj);
	},
	onEmptySelection: function() {
		this.setState(help.onEmptySelection(this.state.infoObj));
	},
	getStreamingData: function(types) {
		if(!queryParams.query) {
			startGet.call(this);
		}
		function startGet() {
			if (!OperationFlag) {
				OperationFlag = true;
				if (this.state.filterInfo.active) {
					this.applyFilter(types);
				}
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
	getQueryBody: function() {
		return help.getQueryBody(this.state.filterInfo, this.state.externalQueryApplied);
	},
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
				this.setChromeTypes(update);
			}.bind(this));
		}
	},
	// only for chrome branch
	setChromeTypes: function(update) {
		const typeInfo = help.setChromeTypes(update);
		setTimeout(function(){
			$('.full_page_loading').addClass('hide');
			this.setState({
				types: typeInfo.update,
				typeCheck: typeInfo.typeCheck,
				connect: true,
				appname: APPNAME
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
		if(window.location.href.indexOf('#?input_state') !== -1 || window.location.href.indexOf('?default=true') !== -1 || window.location.href.indexOf('app=') !== -1) {
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
		const appnameNode = document.getElementById('appname-aka-index');
		if (appnameNode && appnameNode.value) {
			const currentApp = appnameNode.value;
			const allHeaders = localStorage.getItem('customHeaders');
			if (allHeaders) {
				const parsedHeaders = JSON.parse(allHeaders);
				if (parsedHeaders[currentApp]) {
					customHeaders = parsedHeaders[currentApp];
				} else {
					customHeaders = null;
				}
			}
		}
	},

	init_map_stream: function() {
		// this.setMap();
		if(appAuth) {
			setTimeout(this.setMap, 2000)
			setTimeout(this.getStreamingTypes, 2000);
			this.getTotalRecord();
		}
	},
	appnameCb: function(appname) {
		if(this.state.indices) {
			this.setState(help.appnameCb(this.state.indices, this.state.url, this.state.es_host));
		}
	},
	afterConnect: function() {
		if(appAuth) {
			help.afterConnect.bind(this)();
			setTimeout(this.setMap, 2000)
			setTimeout(this.getStreamingTypes, 2000);
			this.getTotalRecord();
			this.setState({
				url: config.url
			});

			// after the app has connected optimistically fetch settings
			this.reloadSettings();
		}
	},
	componentDidUpdate: function() {
		var hiddenColumns = this.state.hiddenColumns;
		help.hideAttribute(hiddenColumns, 'hide');
	},
	removeHidden: function() {
		this.setState(help.removeHidden(this.state.hiddenColumns, this.state.visibleColumns));
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
			// TODO: cleanup - no clue
			// window.stop();
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
		this.setState(help.typeCounter(this.state.typeInfo));
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
				// check for aliasing
				if (get(mappingObjData, [APPNAME, 'mappings'])) {
					$this.setState({
						mappingObj: mappingObjData[APPNAME]['mappings']
					});
				} else if (get(Object.values(mappingObjData)[0], 'mappings')) {
					$this.setState({
						mappingObj: Object.values(mappingObjData)[0].mappings
					});
				} else {
					console.error('Unable to determine mappings');
				}
			}).error(function(xhr){
				if(xhr.status === 401 || xhr.status === 404){
					$this.setState({
						errorShow: true
					});
					appAuth = false;
				}
			});
		}
	},
	handleScroll: function(event) {
		var scroller = document.getElementById('exp-scrollable');
		var infoObj = this.state.infoObj;
		const top = scroller.scrollTop;
		const update = (...args) => {
			this.updateDataOnView(...args);
			scroller.scrollTop = top;
		};
		// Plug in a handler which takes care of infinite scrolling
		if ((subsetESTypes.length || this.state.externalQueryApplied) && infoObj.showing < infoObj.searchTotal && scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight - 50 && !this.state.pageLoading) {
			this.setState({
				loadingSpinner: true
			});
			let sortString = '';
			if (this.state.sortInfo.column) {
				let { column } = this.state.sortInfo;
				const dataMapping = get(this.state.mappingObj, [this.state.sortInfo.type, 'properties', column]);
				const dataMappingType = get(dataMapping, 'type');

				if (dataMappingType === 'string' || dataMappingType === 'text') {
					if (get(dataMapping, 'index') !== 'not_analyzed') {
						const dataMappingFields = get(dataMapping, 'fields');
						if (dataMappingFields) {
							const fieldNonAnalyzed = Object
								.keys(dataMappingFields)
								.find(
									innerField => dataMappingFields[innerField].index === 'not_analyzed' ||
										dataMappingFields[innerField].type === 'keyword'
								); // checks for a raw field in appbase or related field in other generic clusters for sort
							if (fieldNonAnalyzed) {
								column = `${column}.${fieldNonAnalyzed}`;
							}
						}
					}
				}
				sortString += '&sort=' + column + (this.state.sortInfo.reverse ? ':desc' : '');
			}
			help.paginateData(
				this.state.infoObj.total,
				update,
				this.getQueryBody(),
				help.getSelectedTypes(this.state.filterInfo, this.state.externalQueryApplied),
				sortString
			);
		}
	},
	handleSort: function(item, type, eve, order) {
		const dataMapping = get(this.state.mappingObj, [type, 'properties', item]);
		if (!dataMapping && (order === undefined)) {
			return;
		}
		this.setState({ isLoadingData: true });
		const scrollContainer = document.getElementById('table-container');
		const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
		let sortString = '&sort=';
		const dataMappingType = get(dataMapping, 'type');
		if (dataMappingType === 'string' || dataMappingType === 'text') {
			if (get(dataMapping, 'index') === 'not_analyzed') {
				sortString += item;
			} else {
				const dataMappingFields = get(dataMapping, 'fields');
				if (dataMappingFields) {
					const fieldNonAnalyzed = Object
						.keys(dataMappingFields)
						.find(
							innerField => dataMappingFields[innerField].index === 'not_analyzed' ||
								dataMappingFields[innerField].type === 'keyword'
						); // checks for a raw field in appbase or related field in other generic clusters for sort
					if (fieldNonAnalyzed) {
						sortString += `${item}.${fieldNonAnalyzed}`;
					} else {
						sortString += item;
					}
				}
			}
		} else {
			sortString += item;
		}
		// reverse the order if previous reverse state was false
		if ((this.state.sortInfo.column === item && !this.state.sortInfo.reverse) || order) {
			sortString += ':desc';
		}
		feed.applySort(
			subsetESTypes,	// subset es types
			(update, fromStream, total) => {
				if (!fromStream) {
					sdata = [];
					this.resetData(total);
				}
				setTimeout(function() {
					if (update != null)
						this.updateDataOnView(update);
						this.setState({ isLoadingData: false })
						if (scrollContainer) {
							scrollContainer.scrollLeft = scrollLeft;
						}
				}.bind(this), 500);
			},
			this.state.filterInfo.appliedFilter,
			(total, fromStream, method) => {
				this.streamCallback(total, fromStream, method);
				this.setState(help.handleSort(item, type, eve, order, this.state.documents));
			},
			sortString
		);
	},
	addRecord: function(editorref) {
		help.addRecord.call(this, editorref, this.indexCall);
	},
	updateRecord: function(editorref, currentColumn = null) {
		help.updateRecord.call(this, editorref, this.indexCall, currentColumn);
	},
	indexCall: function(form, modalId, method) {
		var recordObject = {};
		$.each(form, function(k2, v2) {
			if (v2.value != '')
				recordObject[v2.name] = v2.value;
		});
		feed.indexData(recordObject, method, function(res, newTypes) {
			if (res.status >= 400) {
				this.setState({
					errorMessage: res.message
				});
				setTimeout(() => {
					this.setState({
						errorShow: true
					});
				}, 100);
			}
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
	showSample: function(obj, editorref) {
		help.showSample(obj, editorref, this.userTouchFlag);
	},
	filterSampleData: function(data) {
		help.filterSampleData.call(this, data, this.setSampleData);
	},
	setSampleData: function(update) {
		if(typeof update != 'undefined') {
			this.setState(help.setSampleData.call(this, update, this.state.typeDocSample));
		}
	},
	applyFilter: function(typeName, columnName, method, value, analyzed) {
		const helpFilter = help.applyFilter.call(this, typeName, columnName, method, value, analyzed, this.state.filterInfo);
		this.setState(helpFilter);
		var filterInfo = helpFilter.filterInfo;
		this.setState({ isLoadingData: true });
		// method, columnName, filterVal, subsetESTypes, analyzed
		if (typeName != '' && typeName != null) {
			feed.filterQuery(filterInfo.appliedFilter, subsetESTypes, function(update, fromStream, total) {
				if (!fromStream) {
					sdata = [];
					this.resetData(total);
				}
				setTimeout(function() {
					if (update != null)
						this.updateDataOnView(update);
						this.setState({ isLoadingData: false });
				}.bind(this), 500);
			}.bind(this), function(total, fromStream, method) {
				this.streamCallback(total, fromStream, method);
			}.bind(this));
		} else {
			this.onEmptySelection();
		}
		this.removeSelection();
	},
	externalQuery: function(query) {
		this.setState(help.externalQueryPre(query, this.removeTypes), this.removeFilter);
		feed.externalQuery(query.query, query.type , (update, fromStream, total) => {
			if (!fromStream) {
				sdata = [];
				this.setState({
					externalQueryTotal: total
				});
				this.resetData(total);
			}
			setTimeout(() => {
				if (update != null) {
					this.updateDataOnView(update);
				}
				$('.full_page_loading').addClass('hide');
			}, 500);
		}, (total, fromStream, method) => {
			this.streamCallback(total, fromStream, method);
		});
	},
	removeExternalQuery: function(cb) {
		if(this.state.externalQueryApplied) {
			feed.removeExternalQuery();
			this.setState({
				externalQueryApplied: false
			}, function() {
				this.removeFilter();
				try {
					if(cb) { cb(); }
				} catch(e) {}
			}.bind(this));
		}
	},
	removeFilter: function(index) {
		this.setState({ isLoadingData: true });
		const callback = () => this.setState({ isLoadingData: false });
		this.setState(help.removeFilter.call(this, index, this.state.externalQueryApplied, this.state.filterInfo, this.applyFilter, this.resetData, this.getStreamingData, this.removeSelection, this.applyFilter, callback));
	},
	removeSort: function() {
		this.setState(help.removeSort(this.state.sortInfo));
	},
	columnToggle: function() {
		var obj = {
			toggleIt: (elementId, checked) => {
				this.setState(help.toggleIt.call(this, elementId, checked, this.state.visibleColumns, this.state.hiddenColumns));
			},
			setVisibleColumn: function() {}
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
		var actionOnRecord = help.watchSelectedRecord.call(this, this.state.actionOnRecord);
		if(!actionOnRecord.selectedRows.length) {
			this.removeSelection();
		} else {
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
		this.setState({
			actionOnRecord: help.getUpdateObj.call(this, this.state.actionOnRecord, this.state.documents)
		});
	},
	deleteRecord: function() {
		$('.loadingBtn').addClass('loading');
		feed.deleteRecord(
			this.state.actionOnRecord.selectedRows,
			function(update) {
				this.setState({
					infoObj: help.deleteRecord.call(this, this.state.infoObj, this.state.actionOnRecord, this.removeSelection, this.resetData, this.getStreamingTypes, this.reloadData)
				});
			}.bind(this),
			(res) => {
				if (res.status >= 400) {
					this.setState({
						errorMessage: res.message
					});
					setTimeout(() => {
						this.setState({
							errorShow: true
						});
					}, 100);
				}
			}
		);
	},
	initEs:function(){
		const temp_config = help.initEs();
		createUrl(temp_config, function() {
			this.connectSync(temp_config);
		}.bind(this));
	},
	connectPlayPause: function() {
		if (this.state.url.startsWith('http://') && window.location.protocol === 'https:') {
			toastr.warning('You are trying to load http content over https. You might have to enable mixed content for your browser https://kb.iu.edu/d/bdny#view');
		}
		if(!help.getReloadFlag()) {
			alert('Url or appname should not be empty.');
		} else {
			const connectInfo = help.connectPlayOrPause(this.state.connect, this.userTouchAdd);
			if(!connectInfo) {
				this.initEs();
			} else {
				this.setState(connectInfo);
			}
		}
	},
	fetchIndices: function(indexUrl) {
		feed.getIndicesAliases(indexUrl)
			.done((res) => {
				const apps = JSON.parse(storageService.getItem('historicApps'));
				const newApps = [
					...(Object.keys(res).map(key => ({
						appname: key, url: indexUrl, fetched: true
					}))),
					...apps
				];
				const appsObject = {};
				const uniqueApps = newApps.filter(app => {
					if(appsObject[app.appname]) {
						return false;
					}
					appsObject[app.appname] = true;
					return true
				});
				// update in state todo
				// focus on app dropdown
				this.setState({
					historicApps: uniqueApps
				});
				storageService.setItem('historicApps', JSON.stringify(uniqueApps));
				setTimeout(() => {
					document.getElementById('appname-aka-index').focus();
				}, 1000);
				this.setState({
					showFetchIndex: true
				});
			})
			.fail(err => {
				console.error(err);
				this.setState({
					showFetchIndex: false
				});
			})
	},
	reloadData: function(){
		this.getStreamingData(subsetESTypes);
		this.getStreamingTypes();
		// reload mappings
		this.setMap();
	},
	reloadSettings: function() {
		feed.getSettings()
			.done(data => this.setState({ settingsObj: data }))
			.done(this.getStreamingTypes)
			.fail(() => console.warn('Unable to fetch settings'))
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
		this.setState({
			dejavuExportData: null
		});
		const defaultQuery = help.defaultQuery();
		const activeQuery = this.getQueryBody() ? this.getQueryBody() : defaultQuery;
		if (!Object.prototype.hasOwnProperty.call(activeQuery, 'size')) {
			activeQuery.size = 1000;
		}
		this.scrollApi({"activeQuery": activeQuery});
	},
	scrollApi: function(info) {
		feed.scrollapi(help.getSelectedTypes(this.state.filterInfo, this.state.externalQueryApplied), info.activeQuery, info.scroll, info.scroll_id)
			.done(function(data) {
				const dejavuExportData =  help.scrollapi.call(this, data, this.scrollApi);
				if(dejavuExportData) {
					this.setState({
						dejavuExportData
					});
				}
			}.bind(this));
	},
	getApps: function(cb) {
		var apps = storageService.getItem('historicApps');
		cb({historicApps: apps});
	},
	setApps: function(authFlag) {
		help.setApps.call(this, authFlag, this.getApps, (info) => {
			this.setState(info);
		});
		const allHeaders = localStorage.getItem('customHeaders');
		if (allHeaders) {
			const parsedHeaders = JSON.parse(allHeaders);
			if (parsedHeaders[this.state.appname]) {
				customHeaders = parsedHeaders[this.state.appname];
			}
		}
	},
	setConfig: function(url) {
		this.setState({
			url: url,
			connect: false
		});
	},
	valChange: function(event) {
		this.setState({ url: event.target.value});
	},
	hideUrlChange: function() {
		this.setState(help.hideUrlChange(this.state.hideUrl));
	},
	render: function() {
		var self = this;
		var EsForm = !this.state.splash ? 'col-xs-12 init-ES': 'col-xs-12 EsBigForm';
		var esText = !this.state.splash ? (this.state.connect ? 'Disconnect':'Connect'): 'Start Browsing';
		var esBtn = this.state.connect ? 'btn-danger ': '';
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
		var githubStar = (<iframe src="https://ghbtns.com/github-btn.html?user=appbaseio&repo=dejavu&type=star&count=true" frameBorder="0" scrolling="0" width="120px" height="20px"></iframe>);
		var composeQuery;
		if(this.state.connect) {
			composeQuery = (<SharedComponents.ComposeQuery />);
		}
		function initialForm() {
			var form = (
				<SharedComponents.InitialForm
					EsForm={EsForm}
					index_create_text={index_create_text}
					shareBtn={shareBtn}
					appSelect={{
						connect: self.state.connect,
						splash: self.state.splash,
						setConfig: self.setConfig,
						apps: self.state.historicApps,
						appnameCb: self.appnameCb
					}}
					url={url}
					valChange={self.valChange}
					opts={opts}
					hideUrl={hideUrl}
					hideEye={hideEye}
					hideUrlChange={self.hideUrlChange}
					hideUrlText={hideUrlText}
					esBtn={esBtn}
					connectPlayPause={self.connectPlayPause}
					playClass={playClass}
					pauseClass={pauseClass}
					esText={esText}
					splash={self.state.splash}
					composeQuery={composeQuery}
					fetchIndices={self.fetchIndices}
					indexUrl={self.state.url}
					connect={self.state.connect}
					showFetchIndex={self.state.showFetchIndex}
				/>
			);
			return form;
		}
		var footer;
		queryParams = getQueryParameters();
		if(!((queryParams && queryParams.hasOwnProperty('hf')) || (queryParams && queryParams.hasOwnProperty('f')))) {
			footer = (<SharedComponents.FooterCombine githubStar={githubStar} />);
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
								importer={{
									appname: this.state.appname,
									url: this.state.url
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
								settingsObj={get(this.state.settingsObj, [this.state.appname, 'settings'])}
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
								loadingSpinner={this.state.loadingSpinner}
								reloadData={this.reloadData}
								reloadSettings={this.reloadSettings}
								exportJsonData= {this.exportJsonData}
								externalQueryApplied={this.state.externalQueryApplied}
								externalQueryTotal={this.state.externalQueryTotal}
								removeExternalQuery={this.removeExternalQuery}
								dejavuExportData={this.state.dejavuExportData}
								reloadMapping={this.setMap}
								isLoadingData={this.state.isLoadingData}
								connect={this.state.connect}
							/>
						</div>
						{footer}
						{
							this.state.errorMessage.length ?
								<FeatureComponent.ErrorModal
									errorShow={this.state.errorShow}
									closeErrorModal={this.closeErrorModal}
									errorMessage={this.state.errorMessage}
								/> :
								<FeatureComponent.ErrorModal
									errorShow={this.state.errorShow}
									closeErrorModal={this.closeErrorModal}
								/>
						}
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
