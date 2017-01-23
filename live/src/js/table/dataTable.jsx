var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Dropdown = require('./Dropdown.jsx');
var FeatureComponent = require('../features/FeatureComponent.jsx');
var FilterDropdown = require('./FilterDropdown.jsx');
var PageLoading = require('./PageLoading.jsx');
var Info = require('./Info.jsx');
var Column = require('./Column.jsx');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Pretty = FeatureComponent.Pretty;
var Cell = require('./Cell.jsx');
var Table = require('./Table.jsx');

// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

// This has the main properties that define the main data table
// i.e. the right side.
var DataTable = React.createClass({
    render: function() {
        var $this = this;
        var data = this.props._data;

        //If render from sort, dont change the order of columns
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
            }
            for (var each in data) {
                fullColumns.type = data[each]['_type'];
                for (column in data[each]) {
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
                }
            }
        }
        var rows = [];
        var visibleColumns = [];
        var renderColumns = [];

        for (var row in data) {
            var newRow = {};
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
            renderRow = [];
            for (var each in newRow) {
                var _key = keyGen(data[row], each);
                elem = document.getElementById(each);
                visibility = '';

                // We see if the column is already closed of open
                // using the html key attribute and render their
                // visibility correspondingly.
                if (elem) {
                    visibility = elem.style.display;
                }
                renderRow.push(<Cell
                                item={newRow[each]}
                                unique={_key}
                                key={_key}
                                columnName={each}
                                _id={data[row]['_id']}
                                _type={data[row]['_type']}
                                visibility={visibility}
                                row={newRow}
                                _checked={newRow._checked}
                                actionOnRecord={$this.props.actionOnRecord} />);
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

        //Extra add btn
        var extraAddBtn = '';
        //Show only when total records are less than 5
        if (this.props.infoObj.availableTotal <= 5) {
            extraAddBtn = <div className="AddExtraBtn">
                            <FeatureComponent.AddDocument
                            types={this.props.Types}
                            addRecord ={this.props.addRecord}
                            getTypeDoc={this.props.getTypeDoc}
                            userTouchAdd={this.props.infoObj.userTouchAdd}
                            link="true"
                            text="&nbsp;&nbsp;Add new data"
                            selectClass="tags-select-big"/>
                          </div>
        }

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
            removeExternalQuery={this.props.removeExternalQuery} />

            {extraAddBtn}

            <div className="outsideTable">
                <Table
                 renderColumns={renderColumns}
                 visibleColumns = {visibleColumns}
                 renderRows={renderRows}
                 scrollFunction={this.props.scrollFunction}
                 selectedTypes={this.props.selectedTypes}
                 filterInfo={this.props.filterInfo} />
            </div>
            {pageLoadingComponent}    
            <input id="copyId" className="hide" />
            </div>
        );
    }
});

module.exports = DataTable;
