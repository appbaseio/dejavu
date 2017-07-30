import { keyGen, rowKeyGen } from "./helper/keys";
import { revertTransition, updateTransition, deleteTransition, newTransition } from "./helper/transitions";

const React = require("react");
const createReactClass = require("create-react-class");
const PureRenderMixin = require("react-addons-pure-render-mixin");
const DataTable = require("./table/DataTable");
const FeatureComponent = require("./features/FeatureComponent");
const Header = require("./Header");
const Sidebar = require("./Sidebar");
const SharedComponents = require("./helper/SharedComponents");
const help = require("./helper/homePageHelper");


const HomePage = createReactClass({
	displayName: "HomePage",
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			documents: [],
			types: [],
			signalColor: "",
			signalActive: "",
			signalText: "",
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
			url: "",
			appname: "",
			splash: true,
			hideUrl: false,
			cleanTypes: false,
			dejavuExportData: null
		};
	},
	flatten(data, callback) {
		const response = help.flatten(data);
		return callback(response.data, response.fields);
	},
	injectLink(data) {
		return data;
	},
	deleteRow(index) {
		delete sdata[index];
	},
	resetData(total, sdataKey) {
		this.setState(help.resetData(total, sdataKey, this.state.sortInfo, this.state.infoObj, this.state.hiddenColumns));
	},
	// Logic to stream continuous data.
	// We call the ``getData()`` function in feed
	// which returns a single JSON document(record).
	updateDataOnView(update, total) {
		if (!Array.isArray(update)) {
			let key;
			update = this.flatten(update, this.injectLink);
			key = rowKeyGen(update);

			// If the record already exists in sdata, it should
			// either be a delete request or a change to an
			// existing record.
			if (sdata[key]) {
				// If the update has a ``_deleted`` field, apply
				// a 'delete transition' and then delete
				// the record from sdata.
				if (update._deleted) {
					Object.keys(sdata[key]).forEach((each) => {
						const _key = keyGen(sdata[key], each);
						deleteTransition(_key);
					});
					deleteTransition(key);
					this.deleteRow(key);
					setTimeout(this.resetData.bind(this), 1100);
				}

				// If it isn't a delete, we should find a record
				// with the same _type and _id and apply an ``update
				// transition`` and then update the record in sdata.
				// Since sdata is modeled as a hashmap, this is
				// trivial.
				else {
					sdata[key] = update;
					this.resetData();
					for (var each in update) {
						updateTransition(keyGen(update, each));
					}
					const key = rowKeyGen(update);
					updateTransition(key);
				}
			}
			// If its a new record, we add it to sdata and then
			// apply the `new transition`.
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
				const key = rowKeyGen(update[each]);
				if (!sdata[key]) {
					sdata[key] = update[each];
				}
			}
			this.resetData(total);
			this.filterSampleData(update);
		}

		// Set sort from url
		if (decryptedData.sortInfo) {
			this.handleSort(decryptedData.sortInfo.column, null, null, decryptedData.sortInfo.reverse);
		}
	},
	streamCallback(total, fromStream, method) {
		let reacordObj;
		if (this.state.externalQueryApplied) {
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
	onEmptySelection() {
		this.setState(help.onEmptySelection(this.state.infoObj));
	},
	getStreamingData(types) {
		if (!queryParams.query) {
			startGet.call(this);
		}
		function startGet() {
			if (!OperationFlag) {
				OperationFlag = true;
				if (this.state.filterInfo.active) {
					this.applyFilter(types);
				}				else if (types.length) {
					const d1 = new Date();
					feed.getData(types, (update, fromStream, total) => {
						if (subsetESTypes.length)								{ this.updateDataOnView(update, total); }						else								{ this.updateDataOnView([], 0); }
					}, (total, fromStream, method) => {
						this.streamCallback(total, fromStream, method);
					});
				} else {
					this.onEmptySelection();
				}
			} else {
				setTimeout(() => { this.getStreamingData(types); }, 300);
			}
		}
	},
	getQueryBody() {
		return help.getQueryBody(this.state.filterInfo, this.state.externalQueryApplied);
	},
	getStreamingTypes() {
		if (typeof APPNAME === "undefined" || APPNAME == null) {
			setTimeout(this.getTotalRecord, 1000);
		} else {
			feed.getTypes((update) => {
				update = update.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
				subsetESTypes.forEach((type) => {
					if (update.indexOf(type) === -1) {
						this.unwatchStock(type);
					}
				});
				this.setChromeTypes(update);
			});
		}
	},
	// only for chrome branch
	setChromeTypes(update) {
		const typeInfo = help.setChromeTypes(update);
		setTimeout(() => {
			$(".full_page_loading").addClass("hide");
			this.setState({
				types: typeInfo.update,
				typeCheck: typeInfo.typeCheck,
				connect: true,
				appname: APPNAME
			}, () => {
				mirageLink(() => {});
			});
		}, 1000);
	},
	removeType(typeName) {
		feed.deleteData(typeName, (data) => {
			this.resetData();
		});
	},
	componentWillMount() {
		if (window.location.href.indexOf("#?input_state") !== -1 || window.location.href.indexOf("?default=true") !== -1) {
			this.setState({
				splash: false
			});
			if (window.location.href.indexOf("?default=true") > -1) {
				this.connectSync(config);
			} else {
				config = {};
				getUrl(this.connectSync);
			}
		}
	},
	componentDidMount() {
		this.setApps();
	},
	connectSync(config_in) {
		config = config_in;
		const self = this;
		this.afterConnect();
		input_state = JSON.parse(JSON.stringify(config_in));
		createUrl(input_state);
		getMapFlag = false;
		$(".full_page_loading").removeClass("hide");
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
		setTimeout(() => {
			appAuth = true;
			self.init_map_stream();
		}, 500);
	},

	init_map_stream() {
		try {
			clearInterval(this.mappingInterval);
			clearInterval(streamingInterval);
		}		catch (e) {}

		// this.setMap();
		if (appAuth) {
			setTimeout(this.setMap, 2000);
			setTimeout(this.getStreamingTypes, 2000);
			// call every 1 min.
			this.mappingInterval = setInterval(this.setMap, 60 * 1000);
			streamingInterval = setInterval(this.getStreamingTypes, 60 * 1000);
			this.getTotalRecord();
		}
	},
	appnameCb(appname) {
		if (this.state.indices) {
			this.setState(help.appnameCb(this.state.indices, this.state.url, this.state.es_host));
		}
	},
	afterConnect() {
		if (appAuth) {
			help.afterConnect.bind(this);
			setTimeout(this.setMap, 2000);
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
	componentDidUpdate() {
		const hiddenColumns = this.state.hiddenColumns;
		help.hideAttribute(hiddenColumns, "hide");
	},
	removeHidden() {
		this.setState(this.removeHidden(this.state.hiddenColumns, this.state.visibleColumns));
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
	unwatchStock(typeName) {
		// Remove sorting while unslecting type
		this.setState({
			sortInfo: {
				active: false
			}
		});
		// Remove sortInfo from store
		if (input_state.hasOwnProperty("sortInfo")) {
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
	removeTypes() {
		subsetESTypes.forEach((typeName) => {
			this.removeType(typeName);
		});
		subsetESTypes = [];
		input_state.selectedType = subsetESTypes;
		createUrl(input_state);
		this.watchSelectedRecord();
		this.applyGetStream();
		window.storageService.setItem("types", JSON.stringify(subsetESTypes));
		this.setState({
			sortInfo: {
				active: false
			},
			cleanTypes: true
		});
	},
	typeCounter() {
		this.setState(help.typeCounter(this.state.typeInfo));
		this.applyGetStream();
	},
	applyGetStream() {
		const typeInfo = this.state.typeInfo;
		if (typeInfo.count >= this.state.types.length) {
			this.getStreamingData(subsetESTypes);
		}
	},
	setMap() {
		const $this = this;
		if (APPNAME && !$(".modal-backdrop").hasClass("in")) {
			const getMappingObj = feed.getMapping();
			getMappingObj.done((data) => {
				const mappingObjData = data;
				if (!getMapFlag) {
					$this.setApps(true);
					getMapFlag = true;
				}
				$this.setState({
					mappingObj: mappingObjData[APPNAME].mappings
				});
			}).error(function (xhr) {
				if (xhr.status == 401) {
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
	handleScroll(event) {
		const scroller = document.getElementById("table-scroller");
		const infoObj = this.state.infoObj;
		// Plug in a handler which takes care of infinite scrolling
		if ((subsetESTypes.length || this.state.externalQueryApplied) && infoObj.showing < infoObj.searchTotal && scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight - 100 && !this.state.pageLoading) {
			this.setState({
				pageLoading: true
			});
			help.paginateData(this.state.infoObj.total, this.updateDataOnView, this.getQueryBody(), help.getSelectedTypes(this.state.filterInfo, this.state.externalQueryApplied));
		}
	},
	handleSort(item, type, eve, order) {
		this.setState(help.handleSort(item, type, eve, order, this.state.documents));
	},
	addRecord(editorref) {
		help.addRecord.call(this, editorref, this.indexCall);
	},
	updateRecord(editorref) {
		help.updateRecord.call(this, editorref, this.indexCall);
	},
	indexCall(form, modalId, method) {
		const recordObject = {};
		$.each(form, (k2, v2) => {
			if (v2.value != "")				{ recordObject[v2.name] = v2.value; }
		});
		feed.indexData(recordObject, method, (res, newTypes) => {
			if (method === "bulk" && res && res.items && res.items.length) {
				this.reloadData();
				if (!res.errors) {
					toastr.success(`${res.items.length} records have been successfully indexed.`);
				} else {
					toastr.error("Your data hasn’t been added, likely cause is a mapper parsing exception.");
				}
			}
			$(".close").click();
			this.getStreamingTypes();
			if (typeof newTypes !== "undefined") {
				this.setState({
					types: newTypes
				});
				setTimeout(() => {
					this.setMap();
				}, 500);
			}
		});
		setTimeout(() => {
			$(".close").click();
			this.getStreamingTypes();
		}, 2000);
	},
	getTypeDoc(editorref) {
		const selectedTypes = $("#setType").val();
		let selectedType;
		if (selectedTypes && selectedTypes.length) {
			selectedType = selectedTypes[0];
		}
		const typeDocSample = this.state.typeDocSample;
		const $this = this;
		if (selectedType != "" && selectedType != null && typeDocSample && typeDocSample.hasOwnProperty(selectedType)) {
			if (typeDocSample.hasOwnProperty(selectedType)) {
				feed.getSingleDoc(selectedType, (data) => {
					try {
						typeDocSample[selectedType] = data.hits.hits[0]._source;
						$this.setState({
							typeDocSample
						});
						$this.showSample(typeDocSample[selectedType], editorref);
					}					catch (err) {
						console.log(err);
					}
				});
			} else this.showSample(typeDocSample[selectedType], editorref);
		}
	},
	userTouchFlag: false,
	showSample(obj, editorref) {
		help.showSample(obj, editorref, this.userTouchFlag);
	},
	filterSampleData(data) {
		help.filterSampleData.call(this, data, this.setSampleData);
	},
	setSampleData(update) {
		if (typeof update !== "undefined") {
			this.setState(help.setSampleData.call(this, update, this.state.typeDocSample));
		}
	},
	applyFilter(typeName, columnName, method, value, analyzed) {
		const helpFilter = help.applyFilter.call(this, typeName, columnName, method, value, analyzed, this.state.filterInfo);
		this.setState(helpFilter);
		const filterInfo = helpFilter.filterInfo;
		// method, columnName, filterVal, subsetESTypes, analyzed
		if (typeName != "" && typeName != null) {
			feed.filterQuery(filterInfo.appliedFilter, subsetESTypes, (update, fromStream, total) => {
				if (!fromStream) {
					sdata = [];
					this.resetData(total);
				}
				setTimeout(() => {
					if (update != null)						{ this.updateDataOnView(update); }
				}, 500);
			}, (total, fromStream, method) => {
				this.streamCallback(total, fromStream, method);
			});
		} else {
			this.onEmptySelection();
		}
		this.removeSelection();
	},
	externalQuery(query) {
		this.setState(help.externalQueryPre(query, this.removeTypes), this.removeFilter);
		feed.externalQuery(query.query, query.type, (update, fromStream, total) => {
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
				$(".full_page_loading").addClass("hide");
			}, 500);
		}, (total, fromStream, method) => {
			this.streamCallback(total, fromStream, method);
		});
	},
	removeExternalQuery(cb) {
		if (this.state.externalQueryApplied) {
			feed.removeExternalQuery();
			this.setState({
				externalQueryApplied: false
			}, () => {
				this.removeFilter();
				try {
					if (cb) { cb(); }
				} catch (e) {}
			});
		}
	},
	removeFilter(index) {
		this.setState(help.removeFilter.call(this, index, this.state.externalQueryApplied, this.state.filterInfo, this.applyFilter, this.resetData, this.getStreamingData, this.removeSelection, this.applyFilter));
	},
	removeSort() {
		this.setState(help.removeSort(this.state.documents));
	},
	columnToggle() {
		const self = this;
		const obj = {
			toggleIt(elementId, checked) {
				self.setState(help.toggleIt.call(this, elementId, checked, this.state.visibleColumns, this.state.hiddenColumns));
			},
			setVisibleColumn() {}
		};
		return obj;
	},
	selectRecord(id, type, row, currentCheck) {
		const selection = help.selectRecord(this.state.actionOnRecord, id, type, row, currentCheck, this.state.documents);
		this.setState({
			actionOnRecord: selection.actionOnRecord
		});
		this.forceUpdate();
	},
	removeSelection() {
		const selection = help.removeSelection(this.state.actionOnRecord, this.state.documents);
		selection.actionOnRecord.selectToggle = false;
		this.setState({
			actionOnRecord: selection.actionOnRecord
		});
		this.forceUpdate();
		$("[name=\"selectRecord\"]").removeAttr("checked");
	},
	watchSelectedRecord() {
		const actionOnRecord = help.watchSelectedRecord.call(this, this.state.actionOnRecord);
		if (!actionOnRecord.selectedRows.length) {
			this.removeSelection();
		} else {
			this.setState({
				actionOnRecord
			});
			this.forceUpdate();
		}
	},
	selectToggleChange(checkbox) {
		const actionOnRecord = help.selectAll(checkbox, this.state.actionOnRecord, this.state.documents);
		actionOnRecord.selectToggle = checkbox;
		this.setState({
			actionOnRecord
		});
		this.forceUpdate();
	},
	getUpdateObj() {
		this.setState({
			actionOnRecord: help.getUpdateObj.call(this, this.state.actionOnRecord, this.state.documents)
		});
	},
	deleteRecord() {
		$(".loadingBtn").addClass("loading");
		feed.deleteRecord(this.state.actionOnRecord.selectedRows, (update) => {
			this.setState({
				infoObj: help.deleteRecord.call(this, this.state.infoObj, this.state.actionOnRecord, this.removeSelection, this.resetData, this.getStreamingTypes)
			});
		});
	},
	initEs() {
		const temp_config = help.initEs();
		createUrl(temp_config, () => {
			this.connectSync(temp_config);
		});
	},
	connectPlayPause() {
		if (!help.getReloadFlag()) {
			alert("Url or appname should not be empty.");
		} else {
			const connectInfo = help.connectPlayOrPause(this.state.connect, this.userTouchAdd);
			if (!connectInfo) {
				this.initEs();
			} else {
				this.setState(connectInfo);
			}
		}
	},
	reloadData() {
		this.getStreamingData(subsetESTypes);
	},
	userTouchAdd(flag) {
		this.userTouchFlag = flag;
	},
	closeErrorModal() {
		this.setState({
			errorShow: false
		});
	},
	exportJsonData() {
		this.setState({
			dejavuExportData: null
		});
		const defaultQuery = help.defaultQuery();
		const activeQuery = this.getQueryBody() ? this.getQueryBody() : defaultQuery;
		this.scrollApi({ activeQuery });
	},
	scrollApi(info) {
		feed.scrollapi(help.getSelectedTypes(this.state.filterInfo, this.state.externalQueryApplied), info.activeQuery, info.scroll, info.scroll_id)
			.done((data) => {
				const dejavuExportData = help.scrollapi.call(this, data, this.scrollApi);
				if (dejavuExportData) {
					this.setState({
						dejavuExportData
					});
				}
			});
	},
	getApps(cb) {
		const apps = storageService.getItem("historicApps");
		cb({ historicApps: apps });
	},
	setApps(authFlag) {
		help.setApps.call(this, authFlag, this.getApps, (info) => {
			this.setState(info);
		});
	},
	setConfig(url) {
		this.setState({
			url,
			connect: false
		});
	},
	valChange(event) {
		this.setState({ url: event.target.value });
	},
	hideUrlChange() {
		this.setState(help.hideUrlChange(this.state.hideUrl));
	},
	render() {
		const self = this;
		const EsForm = !this.state.splash ? "col-xs-12 init-ES" : "col-xs-12 EsBigForm";
		const esText = !this.state.splash ? (this.state.connect ? "Disconnect" : "Connect") : "Start Browsing";
		let esBtn = this.state.connect ? "btn-primary " : "";
		esBtn += "btn btn-default submit-btn";
		const shareBtn = this.state.connect ? "share-btn" : "hide";
		const url = this.state.url;
		const opts = {};
		let playClass = "ib fa fa-play";
		let pauseClass = "hide fa fa-pause";
		if (this.state.connect) {
			opts.readOnly = "readOnly";
			playClass = "hide fa fa-play";
			pauseClass = "ib fa fa-pause";
		}
		const hideEye = { display: this.state.splash ? "none" : "block" };
		const hideUrl = this.state.hideUrl ? "hide-url expand" : "hide-url collapse";
		const hideUrlText = this.state.hideUrl ? React.createElement("span", { className: "fa fa-eye-slash" }, null) : React.createElement("span", { className: "fa fa-eye" }, null);
		const index_create_text = (<div className="index-create-info col-xs-12" />);
		const githubStar = (<iframe src="https://ghbtns.com/github-btn.html?user=appbaseio&repo=dejavu&type=star&count=true" frameBorder="0" scrolling="0" width="120px" height="20px" />);
		let composeQuery;
		if (this.state.connect) {
			composeQuery = (<SharedComponents.ComposeQuery />);
		}
		function initialForm() {
			const form = (
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
				/>
			);
			return form;
		}
		let footer;
		queryParams = getQueryParameters();
		if (!((queryParams && queryParams.hasOwnProperty("hf")) || (queryParams && queryParams.hasOwnProperty("f")))) {
			footer = (<SharedComponents.FooterCombine githubStar={githubStar} />);
		}
		if (!((queryParams && queryParams.hasOwnProperty("hf")) || (queryParams && queryParams.hasOwnProperty("h")))) {
			var dejavuForm = initialForm.call(this);
		}
		const containerClass = `row dejavuContainer ${BRANCH}${queryParams && queryParams.hasOwnProperty("hf") ? " without-hf " : ""}${queryParams && queryParams.hasOwnProperty("h") ? " without-h " : ""}${queryParams && queryParams.hasOwnProperty("f") ? " without-f " : ""}${queryParams && queryParams.hasOwnProperty("sidebar") ? " without-sidebar " : ""}${this.state.splash ? " splash-on " : ""}`;
		return (<div>
			<div id="modal" />
			<div className={containerClass}>
				<div className="appHeaderContainer">
					<Header />
					<div className="appFormContainer">
						{dejavuForm}
						<div className="typeContainer">
							<Sidebar
								typeProps={{
									Types: this.state.types,
									watchTypeHandler: this.watchStock,
									unwatchTypeHandler: this.unwatchStock,
									signalColor: this.state.signalColor,
									signalActive: this.state.signalActive,
									signalText: this.state.signalText,
									typeInfo: this.state.typeInfo,
									selectedTypes: subsetESTypes,
									cleanTypes: this.state.cleanTypes,
									connect: this.state.connect
								}}
								queryProps={{
									externalQuery: this.externalQuery,
									externalQueryApplied: this.state.externalQueryApplied,
									removeExternalQuery: this.removeExternalQuery,
									types: this.state.types
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
								removeFilter={this.removeFilter}
								addRecord={this.addRecord}
								getTypeDoc={this.getTypeDoc}
								Types={this.state.types}
								removeSort={this.removeSort}
								removeHidden={this.removeHidden}
								removeTypes={this.removeTypes}
								visibleColumns={this.state.visibleColumns}
								hiddenColumns={this.state.hiddenColumns}
								columnToggle={this.columnToggle}
								actionOnRecord={this.state.actionOnRecord}
								pageLoading={this.state.pageLoading}
								reloadData={this.reloadData}
								exportJsonData={this.exportJsonData}
								externalQueryApplied={this.state.externalQueryApplied}
								externalQueryTotal={this.state.externalQueryTotal}
								removeExternalQuery={this.removeExternalQuery}
								dejavuExportData={this.state.dejavuExportData}
							/>
						</div>
						{footer}
						<FeatureComponent.ErrorModal
							errorShow={this.state.errorShow}
							closeErrorModal={this.closeErrorModal}
						/>
						<div className="full_page_loading hide">
							<div className="loadingBar" />
							<div className="vertical1" />
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
});

module.exports = HomePage;
