var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Dropdown = require('./dropdown.jsx');
var FeatureComponent = require('../featureComponent.jsx');
var FilterDropdown = require('./filterDropdown.jsx');
var PageLoading = require('./pageLoading.jsx');
var Info = require('./Info.jsx');
var Column = require('./column.jsx');
var Pretty = FeatureComponent.Pretty;
// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

// **Cell** defines the properties of each cell in the
// data table.
var Cell = React.createClass({
    copyId: function() {
        console.log(this.props._type);
        console.log(this.props._id);
        var range = document.createRange();
        var selection = window.getSelection();
        range.selectNodeContents(document.getElementById(this.props.unique));
        selection.removeAllRanges();
        selection.addRange(range);
        $('#copyId').val(this.props._type + '/' + this.props._id).select();
        document.execCommand("copy");
    },
    selectRecord: function(ele) {
        _id = this.props._id;
        _type = this.props._type;
        row = this.props.row;
        this.props.actionOnRecord.selectRecord(_id, _type, row, ele.currentTarget.checked);
    },
    render: function() {
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Popover = ReactBootstrap.Popover;
        var actionOnRecord = this.props.actionOnRecord;

        // exposing visibility property allows us to show / hide
        // individual cells
        var vb = this.props.visibility;
        style = {
            display: vb
        };
        data = this.props.item;
        // The id of the html element is generated
        // in keys.js.
        _id = this.props._id;
        _type = this.props._type;
        to_display = data;
        tdClass = 'column_width columnAdjust';

        var columnName = this.props.columnName;
        var radioId = this.props.unique + 'radio';
        // cell-data of format ``string`` and ``number`` is rendered inline.
        // If a field is a JSON object instead, it's displayed as a modal pop-up.
        // <a href="#"
        //                         onClick={showJSON.bind(null, data, _type, _id)}>
        //                         <i className="fa fa-external-link" />
        //                     </a>;
        var appIdClass = "appId";
        actionOnRecord.selectedRows.forEach((v) => {
            if (v._id == _id)
                appIdClass += " showRow";
        });
        if (columnName == 'json') {
            prettyData = <Pretty json={data} />
            to_display = <div className={appIdClass}>
                            <span className="theme-element selectrow checkbox">
                                <input onChange={this.selectRecord} className="rowSelectionCheckbox" type="checkbox" name="selectRecord"
                                 value={_id} data-type={_type} id={radioId} />
                                <label htmlFor={radioId}></label>
                            </span>
                            <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
                                <a href="javascript:void(0);" className="appId_icon bracketIcon"></a>
                            </OverlayTrigger>
                            <span className="appId_name" onClick={this.copyId}>
                                <span className="appId_appname" title={_type}>{_type}&nbsp;/&nbsp;</span>
                                <span className="appId_id" title={_id}>{_id}</span>
                            </span>
                        </div>;
            tdClass = 'column_width';
        } else {
            if (typeof data !== 'string') {
                if (typeof data !== 'number') {
                    prettyData = <Pretty json={data} />
                    to_display = <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
                                    <a href="javascript:void(0);"  className="bracketIcon">
                                    </a>
                                </OverlayTrigger>
                    tdClass = 'column_width';
                }
            }
        }
        return <td
                 width={cellWidth}
                id={this.props.unique}
                key={this.props.unique}
                style={style}
                className={tdClass}>
                    {to_display}
                </td>;
    }
});

// This is another wrapper around the data table to implement
// pagination, throbbers, styling etc.
var Table = React.createClass({
    componentDidMount: function() {
        console.log("mounted");
        var elem = document.getElementById('table-scroller');
        // WE are listning for scroll even so we get notified
        // when the scroll hits the bottom. For pagination.
        elem.addEventListener('scroll', this.props.scrollFunction);
    },
    render: function() {
        var column_width = 250;
        var elem = document.getElementById('table-scroller');
        if (elem != null) {
            elem.style.width = this.props.visibleColumns.length * column_width + 'px';
        }
        return (
            <div id='table-container' className="table-container">
                <div id="table-scroller" className="table-scroller">
                    <table id="data-table"
                    className="table table-fixedheader table-bordered">
                        <thead id='columns'>
                            <tr>
                                {this.props.renderColumns}
                            </tr>
                        </thead>
                        <tbody className='exp-scrollable'>
                                {this.props.renderRows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
})

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
            } else {
                fixed = [];
                columns = [];
            }

            fullColumns = {
                type: '',
                columns: columns
            }
            for (var each in data) {
                fullColumns.type = data[each]['_type'];
                for (column in data[each]) {
                    if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type') {
                        if (fullColumns.columns.indexOf(column) <= -1) {
                            fullColumns.columns.push(column);
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
                                actionOnRecord={$this.props.actionOnRecord}/>);
            }
            rows.push({
                '_key': String(data[row]['_id']) + String(data[row]['_type']),
                'row': renderRow
            });
        }
        var renderColumns = fullColumns.columns.map(function(item) {
            return (<Column _item={item} key={item}
                        _type={fullColumns.type}
                        _sortInfo={$this.props.sortInfo}
                        handleSort={$this.props.handleSort}
                        mappingObj={$this.props.mappingObj}
                        filterInfo={$this.props.filterInfo} />);
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
                            link="true"
                            text="&nbsp;&nbsp;Add new data"
                            selectClass="tags-select-big"/>
                          </div>
        }

        return (
            <div className="dejavu-table">

            <Info infoObj={this.props.infoObj}
            filterInfo = {this.props.filterInfo}
            removeFilter={this.props.removeFilter}
            removeSort = {this.props.removeSort}
            types={this.props.Types}
            addRecord ={this.props.addRecord}
            getTypeDoc={this.props.getTypeDoc}
            sortInfo ={this.props.sortInfo}
            columns = {columns}
            visibleColumns={visibleColumns}
            columnToggle ={this.props.columnToggle}
            actionOnRecord={this.props.actionOnRecord} />

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
            <PageLoading  
                key="123" 
                visibleColumns={visibleColumns}
                infoObj={this.props.infoObj}>
            </PageLoading>
             <input id="copyId" className="hide" />
            </div>
        );
    }
});

module.exports = DataTable;