var React = require('react');
var PageLoading = require('./PageLoading.js');
var Info = require('./Info.js');
var Column = require('./Column.js');
var Cell = require('./Cell.js');
var Table = require('./Table.js');
var FeatureComponent = require('../features/FeatureComponent.js');
import AddColumnButton from './AddColumnButton';

// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

// This has the main properties that define the main data table
// i.e. the right side.
class DataTable extends React.Component {
	render() {
		var $this = this;
		var data = this.props._data;
		var fixed = [], columns, initial_final_cols;
		const arrayOptions = {};
		//If render from sort, dont change the order of columns
		// TODO: optimize logic
		if (!$this.props.sortInfo.active) {
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
					if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type' && column != '_checked') {
						if (fullColumns.columns.indexOf(column) <= -1) {
							fullColumns.columns.push(column);
							var obj = {
								type: data[each]['_type'],
								column: column
							};
							fullColumns.final_cols.push(obj);
						}
					}
					if (Array.isArray(data[each][column])) {
						if (arrayOptions[column]) {
							data[each][column].forEach((item) => {
								if (!arrayOptions[column].includes(item)) {
									arrayOptions[column].push(item);
								}
							});
						} else {
							arrayOptions[column] = [...data[each][column]];
						}
					}
				}
			}
		} else {
			for (var each in data) {
				for (var column in data[each]) {
					if (Array.isArray(data[each][column])) {
						if (arrayOptions[column]) {
							data[each][column].forEach((item) => {
								if (!arrayOptions[column].includes(item)) {
									arrayOptions[column].push(item);
								}
							});
						} else {
							arrayOptions[column] = [...data[each][column]];
						}
					}
				}
			}
		}

		// identify and add new columns from mappingObj
		if (this.props.selectedTypes.length) {
			const { mappingObj } = this.props;
			this.props.selectedTypes.forEach((selectedType) => {
				const allProperties = Object.keys(mappingObj[selectedType].properties);
				allProperties.map((item) => {
					if (!fullColumns.columns.includes(item)) {
						fullColumns.columns.push(item);
						fullColumns.final_cols.push({ column: item, type: selectedType });
					}
				});
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
						var cell = data[row][columns[each]];
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
						datatype={this.props.mappingObj[data[row]._type].properties[each]}
						arrayOptions={arrayOptions[each]}
						rowNumber={Number(row)}
					/>);
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

				<Info infoObj= {this.props.infoObj}
					totalRecord= {this.props.totalRecord}
					filterInfo = {this.props.filterInfo}
					removeFilter= {this.props.removeFilter}
					removeSort = {this.props.removeSort}
					removeTypes = {this.props.removeTypes}
					removeHidden = {this.props.removeHidden}
					types={this.props.Types}
					addRecord = {this.props.addRecord}
					getTypeDoc= {this.props.getTypeDoc}
					sortInfo = {this.props.sortInfo}
					columns = {columns}
					visibleColumns = {visibleColumns}
					hiddenColumns = {this.props.hiddenColumns}
					columnToggle = {this.props.columnToggle}
					actionOnRecord= {this.props.actionOnRecord}
					reloadData = {this.props.reloadData}
					exportJsonData = {this.props.exportJsonData}
					selectedTypes = {this.props.selectedTypes}
					externalQueryApplied={this.props.externalQueryApplied}
					externalQueryTotal={this.props.externalQueryTotal}
					removeExternalQuery={this.props.removeExternalQuery}
					dejavuExportData={this.props.dejavuExportData} />

				<div className="outsideTable">
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
					/>
					{
						this.props.selectedTypes.length ?
							<AddColumnButton
								selectedTypes={this.props.selectedTypes}
								mappingObj={this.props.mappingObj}
								reloadMapping={this.props.reloadMapping}
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
