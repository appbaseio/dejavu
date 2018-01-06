import React from 'react';
import get from 'lodash/get';

/* global feed */

import AddColumnButton from './AddColumnButton';
var PageLoading = require('./PageLoading.js');
var Info = require('./Info.js');
var Column = require('./Column.js');
var Cell = require('./Cell.js');
var Table = require('./Table.js');
var FeatureComponent = require('../features/FeatureComponent.js');

// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

// This has the main properties that define the main data table
// i.e. the right side.
class DataTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editable: getQueryParameters() ? getQueryParameters().editable === 'true' : false,
			arrayOptions: {},
			hasImages: false,
			loadImages: true
		};
	}

	componentDidMount() {
		if (getQueryParameters()) {
			setQueryParamerter('editable', this.state.editable);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props._data !== nextProps._data && Array.isArray(nextProps._data)) {
			const arrayFields = {};
			const data = nextProps._data;
			let hasImages = false;
			for (let i = 0; i < 10 && i !== data.length; i += 1) {
				Object.keys(data[i]).forEach((column) => {
					const type = data[i]._type;
					const datatype = get(this.props.mappingObj[type], ['properties', column, 'type']);
					// check for images
					if (get(this.props.mappingObj[type], ['_meta', 'dejavuMeta', column]) === 'image' && !hasImages) {
						hasImages = true;
					}
					if (Array.isArray(data[i][column]) && datatype === 'string') {
						if (!arrayFields[column]) {
							arrayFields[column] = type;
						}
					}
				});
			}
			if (this.state.hasImages !== hasImages) {
				this.setState({
					hasImages
				});
			}
			Object.keys(arrayFields).forEach((field) => {
				if (!this.state.arrayOptions[field]) {
					feed.getAggregations(arrayFields[field], field, this.setArrayOptions);
				}
			});
		}
	}

	setArrayOptions = (field, options) => {
		const { arrayOptions } = this.state;
		const availableOptions = options.map(item => item.key);
		arrayOptions[field] = availableOptions;
		this.setState({ arrayOptions });
	}

	toggleEditView = () => {
		const nextState = !this.state.editable;
		this.setState({
			editable: nextState
		});
		setQueryParamerter('editable', nextState);
	}

	toggleLoadImages = () => {
		const nextState = !this.state.loadImages;
		this.setState({
			loadImages: nextState
		});
	}

	render() {
		var $this = this;
		var data = this.props._data;
		var fixed = [], columns, initial_final_cols;
		const { arrayOptions } = this.state;
		//If render from sort, dont change the order of columns
		// TODO: optimize logic
		if ($this.props.infoObj.showing != 0) {
			fixed = ['json'];
			columns = ['json'];
			initial_final_cols = [{column: 'json', type: ''}];
		} else {
			fixed = [];
			columns = [];
			initial_final_cols = [];
		}

		fullColumns = {
			type: '',
			columns: columns,
			final_cols: initial_final_cols
		};
		for (var each in data) {
			fullColumns.type = data[each]['_type'];
			for (var column in data[each]) {
				if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type' && column != '_checked' && column !== '_score' && column !== 'sort') {
					if (fullColumns.columns.indexOf(column) <= -1) {
						fullColumns.columns.push(column);
						var obj = {
							type: data[each]['_type'],
							column: column
						};
						fullColumns.final_cols.push(obj);
					}
				}
			}
		}

		// identify and add new columns from mappingObj
		if (this.props.selectedTypes.length) {
			const { mappingObj } = this.props;
			this.props.selectedTypes.forEach((selectedType) => {
				if (mappingObj[selectedType]) {
					if (mappingObj[selectedType].properties) {
						const allProperties = Object.keys(mappingObj[selectedType].properties);
						allProperties.map((item) => {
							if (!fullColumns.columns.includes(item)) {
								fullColumns.columns.push(item);
								fullColumns.final_cols.push({ column: item, type: selectedType });
							}
						});
					}
				}
				// since a new object type has no mapping added, populate the column from _meta
				if (mappingObj[selectedType] && mappingObj[selectedType]._meta) {
					if (Object.prototype.hasOwnProperty.call(mappingObj[selectedType]._meta, 'dejavuMeta')) {
						const metaFields = Object.keys(mappingObj[selectedType]._meta.dejavuMeta);
						metaFields.forEach((item) => {
							if (!fullColumns.columns.includes(item) && mappingObj[selectedType]._meta.dejavuMeta[item] === 'object') {
								fullColumns.columns.push(item);
								fullColumns.final_cols.push({ column: item, type: selectedType });
							}
						})
					}
				}
			})
		}

		const sortedColumns = fullColumns.columns.slice(1).sort();
		const sortedFinalColumns = fullColumns.final_cols.slice(1).sort((a, b) => {
			if (a.column < b.column) {
				return -1;
			} else if (a.column > b.column) {
				return 1;
			}
			return 0;
		});

		fullColumns.columns = [...fullColumns.columns.slice(0, 1), ...sortedColumns];
		fullColumns.final_cols = [...fullColumns.final_cols.slice(0, 1), ...sortedFinalColumns];

		var rows = [];
		var visibleColumns = [];
		var renderColumns = [];
		const allDatatypes = this.props.selectedTypes.reduce((allFields, currentType) => {
			if (this.props.mappingObj[currentType] && this.props.mappingObj[currentType].properties) {
				return { ...allFields, ...this.props.mappingObj[currentType].properties };
			}
			return { ...allFields };
		}, {});
		const allMetas = this.props.selectedTypes.reduce((allFields, currentType) => {
			if (this.props.mappingObj[currentType] && this.props.mappingObj[currentType]._meta) {
				if (this.props.mappingObj[currentType]._meta.dejavuMeta) {
					return { ...allFields, ...this.props.mappingObj[currentType]._meta.dejavuMeta };
				}
			}
			return { ...allFields };
		}, {});
		for (var row in data) {
			var newRow = {};
			var columns = fullColumns.columns;
			newRow['json'] = data[row]['json'];
			// newRow['_type'] = data[row]['_type'];
			// newRow['_id'] = data[row]['_id'];
			for (var each in columns) {
				// We check if every column of the new document
				// is present already, if not we appen to the
				// right.
				if (fixed.indexOf(columns[each]) <= -1) {
					if (data[row].hasOwnProperty([columns[each]])) {
						const cell = data[row][columns[each]];
						if (
							Array.isArray(cell) &&
							this.props.sortInfo &&
							this.props.sortInfo.active &&
							this.props.sortInfo.column === columns[each] &&
							this.props.sortInfo.reverse
						) {
							cell.reverse();
						}
						newRow[columns[each]] = cell;
					} else {
						// Just to make sure it doesn't display
						// a null.
						newRow[columns[each]] = '';
					}
				}
			}
			var renderRow = [];
			for (var each in newRow) {
				var _key = keyGen(data[row], each);
				var elem = document.getElementById(each);
				var visibility = '';

				// We see if the column is already closed of open
				// using the html key attribute and render their
				// visibility correspondingly.
				if (elem) {
					visibility = elem.style.display;
				}
				const type = data[row]._type;
				const { mappingObj } = this.props;
				let isObject = false;
				let isArrayObject = false;
				let isImage = false;
				let datatype = {};
				if (mappingObj[type].properties) {
					datatype = mappingObj[type].properties[each] || allDatatypes[each];
				}
				if (mappingObj[type]._meta) {
					if (mappingObj[type]._meta.hasOwnProperty('dejavuMeta')) {
						if (mappingObj[type]._meta.dejavuMeta[each] === 'array' && !arrayOptions[each] && get(datatype, 'type') === 'string') {
							arrayOptions[each] = [];
						} else if (mappingObj[type]._meta.dejavuMeta[each] === 'object') {
							isObject = true;
						} else if (mappingObj[type]._meta.dejavuMeta[each] && mappingObj[type]._meta.dejavuMeta[each].indexOf('array') !== -1) {
							isObject = true;
							isArrayObject = true;
						} else if (mappingObj[type]._meta.dejavuMeta[each] === 'image') {
							isImage = true;
						}
					}
				}
				if (allMetas[each] === 'object') {
					isObject = true;
				} else if (allMetas[each] === 'array') {
					isObject = true;
					isArrayObject = true;
				}
				if (datatype && allMetas[each] !== 'array-image') {
					if (datatype.type === 'geo_shape') {
						isObject = true;
					}
					else if (datatype.type === 'string') {
						isObject = false;
						isArrayObject = false;
					}
				}
				// for array fields that are not created via dejavu
				if (datatype && Object.hasOwnProperty.call(datatype, 'properties')) {
					isObject = true;
				}
				renderRow.push(
					<Cell
						item={newRow[each]}
						unique={_key}
						key={_key}
						columnName={each}
						_id={data[row]['_id']}
						_type={data[row]['_type']}
						visibility={visibility}
						row={newRow}
						_checked={newRow._checked}
						actionOnRecord={$this.props.actionOnRecord}
						datatype={datatype}
						arrayOptions={arrayOptions[each]}
						rowNumber={Number(row)}
						editable={this.state.editable}
						isObject={isObject}
						isArrayObject={isArrayObject}
						isImage={isImage}
						loadImages={this.state.loadImages}
					/>
				);
			}
			rows.push({
				'_key': String(data[row]['_id']) + String(data[row]['_type']),
				'row': renderRow
			});
		}
		var renderColumns = fullColumns.final_cols.map(function(item) {
			return (<Column _item={item.column} key={item.column}
				_type={item.type}
				_sortInfo={$this.props.sortInfo}
				handleSort={$this.props.handleSort}
				mappingObj={$this.props.mappingObj}
						filterInfo={$this.props.filterInfo}
						externalQueryApplied={$this.props.externalQueryApplied} />);
		});
		var visibleColumns = this.props.visibleColumns;

		var renderRows1 = [];

		// //If render from sort, dont render the coumns
		var renderRows = rows.map(function(item, key) {
			var _key = item['_key'];
			var row = item['row'];
			return (<tr id={_key} key={_key}>
						{row}
					</tr>);
		});

		//Page loading - show while paging
		var pageLoadingComponent = this.props.pageLoading ?
			(<PageLoading
				key="123"
				visibleColumns={visibleColumns}
										pageLoading={this.props.pageLoading}>
									</PageLoading>) : '';

		return (
			<div className="dejavu-table">
				<Info
					infoObj={this.props.infoObj}
					totalRecord={this.props.totalRecord}
					filterInfo={this.props.filterInfo}
					removeFilter={this.props.removeFilter}
					removeSort={this.props.removeSort}
					removeTypes={this.props.removeTypes}
					removeHidden={this.props.removeHidden}
					types={this.props.Types}
					addRecord={this.props.addRecord}
					getTypeDoc={this.props.getTypeDoc}
					sortInfo={this.props.sortInfo}
					columns={columns}
					visibleColumns={visibleColumns}
					hiddenColumns={this.props.hiddenColumns}
					columnToggle={this.props.columnToggle}
					actionOnRecord={this.props.actionOnRecord}
					reloadData={this.props.reloadData}
					exportJsonData={this.props.exportJsonData}
					selectedTypes={this.props.selectedTypes}
					externalQueryApplied={this.props.externalQueryApplied}
					externalQueryTotal={this.props.externalQueryTotal}
					removeExternalQuery={this.props.removeExternalQuery}
					dejavuExportData={this.props.dejavuExportData}
					editable={this.state.editable}
					toggleEditView={this.toggleEditView}
					hasImages={this.state.hasImages}
					loadImages={this.state.loadImages}
					toggleLoadImages={this.toggleLoadImages}
				/>

				<div className="outsideTable">
					{
						this.props.isLoadingData &&
						<div
							className="sort-loading-spinner"
							style={{
								paddingLeft: (window.innerWidth - 270) / 2
							}}
						>
							<i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw page-loading-spinner-icon" aria-hidden="true" />
						</div>
					}
					<Table
						renderColumns={renderColumns}
						visibleColumns = {visibleColumns}
						renderRows={renderRows}
						scrollFunction={this.props.scrollFunction}
						selectedTypes={this.props.selectedTypes}
						filterInfo={this.props.filterInfo}
						types={this.props.Types}
						addRecord ={this.props.addRecord}
						getTypeDoc={this.props.getTypeDoc}
						userTouchAdd={this.props.infoObj.userTouchAdd}
						editable={this.state.editable}
						loadingSpinner={this.props.loadingSpinner}
						isLoadingData={this.props.isLoadingData}
					/>
					{
						this.props.selectedTypes.length && this.state.editable && !this.props.isLoadingData ?
							<AddColumnButton
								selectedTypes={this.props.Types}
								mappingObj={this.props.mappingObj}
								settingsObj={this.props.settingsObj}
								reloadMapping={this.props.reloadMapping}
								reloadData={this.props.reloadData}
								reloadSettings={this.props.reloadSettings}
							/> :
							null
					}
				</div>
				{pageLoadingComponent}
			<input id="copyId" className="hide" />
			</div>
		);
	}
}

module.exports = DataTable;
