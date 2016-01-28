var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Dropdown = require('./dropdown.jsx');
var FeatureComponent = require('./FeatureComponent.jsx');
var Pretty = FeatureComponent.Pretty;

// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
var cellWidth = '250px';

//Radio button with appropriate search input field
var SingleMenuItem = React.createClass({
    getInitialState:function(){
        return {
            filterField:'',
            filterValue:''
        };
    },
    changeFilter:function(e){
        var filterField = e.currentTarget.value;
        this.props.changeFilter(filterField, this.state.filterValue);
        var key = filterKeyGen(this.props.columnField,this.props.val);
        var keyInput = key+'-input';
        setTimeout(() => {
            $('#'+keyInput).focus();
        },300);
        //this.setState({filterField:filterField});
    },
    valChange:function(e){
        var filterValue = e.currentTarget.value;
        this.setState({filterValue:filterValue});
        this.props.getFilterVal(filterValue);
    },
    render: function(){
        var singleItemClass = this.props.filterField == this.props.val ? 'singleItem active':'singleItem';
        var placeholder = this.props.val == 'has' || this.props.val == 'has not' ? 'Type , for multiple':'Type here...';
        var key = filterKeyGen(this.props.columnField,this.props.val);
        var keyInput = key+'-input';
        return (<div className={singleItemClass}>
                    <div className="theme-element radio">
                        <input onChange={this.changeFilter} type="radio" name="optionsRadios"
                         value={this.props.val} id={key} />
                        <label htmlFor={key}><span className="lableText">{this.props.val}</span></label>
                    </div>
                      <div className="searchElement">
                        <input id={keyInput} className="form-control" type="text" placeholder={placeholder} onKeyUp={this.valChange} />
                      </div>
                </div>);
    }
});


//Filter dropdown for each column header
var FilterDropdown = React.createClass({
    getInitialState:function(){
        return {
                    filterField:null,
                    filterValue:null
                };
    },
    changeFilter : function(field, value){
       this.setState({
                        filterField:field,
                        filterValue:value
                    });
    },
    getFilterVal:function(val){
        this.setState({filterValue:val});
    },
    applyFilter:function(){
        if(this.state.filterField != null && this.state.filterValue != null && this.state.filterValue != '')
           this.props.filterInfo.applyFilter(this.props.type, this.props.columnField, this.state.filterField, this.state.filterValue);
    },
    render:function(){
            var ButtonToolbar = ReactBootstrap.ButtonToolbar;
            var DropdownButton = ReactBootstrap.DropdownButton;
            var MenuItem = ReactBootstrap.MenuItem;
            var Dropdown = ReactBootstrap.Dropdown;
            var datatype = this.props.datatype;
            var applyBtn = this.state.filterValue == '' ? 'true' : 'false';
            var stringFilter = (
                                <Dropdown.Menu className="menuItems pull-right pd-0">
                                    <SingleMenuItem columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} getFilterVal={this.getFilterVal} val="search" />
                                    <SingleMenuItem columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} getFilterVal={this.getFilterVal} val="has" />
                                    <SingleMenuItem columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} getFilterVal={this.getFilterVal} val="has not" />
                                    <div className="singleItem">
                                        <button className='btn btn-info col-xs-12' onClick={this.applyFilter}>Apply</button>
                                    </div>
                                </Dropdown.Menu>
                              );

            var numberFilter = (
                                <Dropdown.Menu className="menuItems pull-right">
                                    <SingleMenuItem  columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} getFilterVal={this.getFilterVal} val="greater than" />
                                    <SingleMenuItem  columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} getFilterVal={this.getFilterVal} val="less than" />
                                    <div className="singleItem">
                                        <button className='btn btn-info col-xs-12' onClick={this.applyFilter}>Apply</button>
                                    </div>
                                </Dropdown.Menu>
                              );


            var dateFilter = (
                                <Dropdown.Menu className="menuItems pull-right">
                                    <SingleMenuItem  columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} datatype={datatype} getFilterVal={this.getFilterVal} val="greater than" />
                                    <SingleMenuItem  columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} datatype={datatype} getFilterVal={this.getFilterVal} val="less than" />
                                    <div className="singleItem">
                                        <button className='btn btn-info col-xs-12' onClick={this.applyFilter}>Apply</button>
                                    </div>
                                </Dropdown.Menu>
                              );

            var FilterMenuItems = '';

            switch(datatype){
                case 'string':
                    FilterMenuItems = stringFilter;
                break;
                case 'long':
                case 'integer':
                case 'short':
                case 'byte':
                case 'double':
                case 'float':
                    FilterMenuItems = numberFilter;
                break;
                case 'date':
                    FilterMenuItems = dateFilter;
                break;
                default:
                    datatype = null;
                break;
            }

            if(datatype == null){
                return (<span></span>);
            }
            else{
                return (<div className="filterDropdown">
                    <ButtonToolbar>
                        <Dropdown id="ab" className="filterDropdownContainer">
                          <Dropdown.Toggle className="filterBtn">
                            <i className="fa fa-filter"></i>
                          </Dropdown.Toggle>
                            {FilterMenuItems}
                        </Dropdown>
                    </ButtonToolbar>
                </div>);
            }
    }
});

var Column = React.createClass({
    getInitialState:function(){
        return {type:null};
    },
    sortingInit:function(){
        this.props.handleSort(this.props._item, this.props._type, this);
    },
    componentDidMount:function(){
        this.setState({type:this.props._type});
    },
    render: function(){
        var item = this.props._item;
        var type = this.state.type == null ? this.props._type : this.state.type;
        var sortInfo = this.props._sortInfo;
        var filterInfo = this.props.filterInfo;

        var filterClass = filterInfo.active && filterInfo.columnName == item ? 'filterActive' : '';
        var extraClass = sortInfo.column == item ? 'sortActive '+sortInfo.reverse : '';
        var fixedHead = 'table-fixed-head column_width '+extraClass+' '+filterClass;
        var filterId = 'filter-'+item;
        var datatype = null;
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Popover = ReactBootstrap.Popover;
        prettyData =  " Clicking on {...} displays the JSON data. ";
        var itemText = item == 'json' ? <span>
                <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson jsonTitle">{prettyData}</Popover>}>
                    <a href="javascript:void(0);" className="bracketIcon"></a>
                </OverlayTrigger>
                <span onClick={this.sortingInit}>&nbsp;&nbsp;type / id</span>
            </span>
             : <span onClick={this.sortingInit}>{item}</span>;
        var thtextShow = item == 'json' ? 'leftGap thtextShow':'thtextShow';
        if(typeof this.props.mappingObj[type] != 'undefined' && typeof this.props.mappingObj[type]['properties'][item] != 'undefined'){
            datatype = this.props.mappingObj[type]['properties'][item].type;
        }
        //console.log(datatype, item);
        //var handleSort = this.sortingInit;

        return (<th id={item} width={cellWidth} className="tableHead">
                    <div className={fixedHead}>
                        <div className="headText">
                            <div className={thtextShow}>
                                {itemText}
                            </div>
                            <div className="iconList">
                                <span className="sortIcon"  onClick={this.sortingInit}>
                                    <i className ="fa fa-chevron-up asc-icon" />
                                    <i className ="fa fa-chevron-down desc-icon" />
                                </span>
                                <span className="filterIcon">
                                    <FilterDropdown columnField={item} type={type} datatype = {datatype} filterInfo={this.props.filterInfo} />
                                </span>
                            </div>
                        </div>
                    </div>
                </th>);
    }
});


// **Cell** defines the properties of each cell in the
// data table.
var Cell = React.createClass({
    copyId:function(){
        console.log(this.props._type);
        console.log(this.props._id);
        var range = document.createRange();
        var selection = window.getSelection();
        range.selectNodeContents(document.getElementById(this.props.unique));
        selection.removeAllRanges();
        selection.addRange(range);
        $('#copyId').val(this.props._type+'/'+this.props._id).select();
        document.execCommand("copy");
    },
    selectRecord:function(ele){
        _id = this.props._id;
        _type = this.props._type;
        row = this.props.row;
        this.props.actionOnRecord.selectRecord(_id,_type, row, ele.currentTarget.checked);
    },
    render: function(){
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var Popover = ReactBootstrap.Popover;
        var actionOnRecord = this.props.actionOnRecord;

        // exposing visibility property allows us to show / hide
        // individual cells
        var vb = this.props.visibility;
            style = {display:vb};
            data = this.props.item;
            // The id of the html element is generated
            // in keys.js.
            _id = this.props._id;
            _type = this.props._type;
            to_display = data;

        var columnName = this.props.columnName;
        var radioId = this.props.unique+'radio';
        // cell-data of format ``string`` and ``number`` is rendered inline.
        // If a field is a JSON object instead, it's displayed as a modal pop-up.
        // <a href="#"
        //                         onClick={showJSON.bind(null, data, _type, _id)}>
        //                         <i className="fa fa-external-link" />
        //                     </a>;
        var appIdClass = "appId";
        actionOnRecord.selectedRows.forEach((v) => {
            if(v._id == _id)
                appIdClass += " showRow";
        });
        if(columnName == 'json'){
            prettyData =  <Pretty json={data} />
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
                        </div>
        }
        else{
            if(typeof data !== 'string'){
                if(typeof data !== 'number'){
                    prettyData =  <Pretty json={data} />
                    to_display = <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
                                    <a href="javascript:void(0);"  className="bracketIcon">
                                    </a>
                                </OverlayTrigger>
                }
            }
        }
        return <td
                 width={cellWidth}
                id={this.props.unique}
                key={this.props.unique}
                style={style}
                className="column_width">
                    {to_display}
                </td>;
    }
});

// This is just to give  unique id to the rows so that we can add
// CSS transitions upon updates/deletes
var Row = React.createClass({
    render: function(){
        return <tr id={this.props._id}>{this.props.row}</tr>;
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
        if(elem != null){
            elem.style.width = this.props.visibleColumns.length*column_width+'px';
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

var Info = React.createClass({
    render:function(){
        var infoObj = this.props.infoObj;
        var filterInfo = this.props.filterInfo;
        var sortInfo = this.props.sortInfo;
        var actionOnRecord = this.props.actionOnRecord;
        var filterClass = filterInfo.active ? 'pull-right text-right pd-r10':'hide';
        var sortClass = sortInfo.active ? 'pull-right text-right pd-r10':'hide';
        var infoObjClass = infoObj.total == 0 ? "hide":"pull-left text-left pd-l0 recordTotalRow";
        var sortAscClass = sortInfo.active && sortInfo.reverse ? 'fa fa-sort-alpha-desc' : 'fa fa-sort-alpha-asc';
        var totalClass = actionOnRecord.active ? 'hide' :'col-xs-12';
        var selectionClass = actionOnRecord.active ? 'col-xs-12' :'hide';

        var UpdateDocument = actionOnRecord.selectedRows.length == 1 ? <FeatureComponent.UpdateDocument actionOnRecord={actionOnRecord}/> : '';

        return (
                <div className="infoRow container">
                <div className=" row">
                    <div className={infoObjClass}>
                        <div className={totalClass}>
                            <span className="info_single">
                                <label>Showing <strong>{infoObj.showing}</strong> of total
                                <strong>&nbsp;{infoObj.total}</strong>
                                </label>
                            </span>
                        </div>
                        <div className={selectionClass}>
                            <span className="pull-left  pd-r10 info_single">
                                <strong>{ actionOnRecord.selectedRows.length}</strong> selected of total <strong>
                                    {infoObj.total}
                                </strong>
                            </span>

                            <span className="pull-left">
                                {UpdateDocument}

                                <FeatureComponent.DeleteDocument
                                actionOnRecord={actionOnRecord}/>

                                <a href="javascript:void(0);" className="info_single"
                                 onClick={actionOnRecord.removeSelection}>Remove Selection</a>
                            </span>
                        </div>
                    </div>
                    <div className="pull-right pd-r0">
                        <Dropdown
                        visibleColumns ={this.props.visibleColumns}
                        columnToggle ={this.props.columnToggle}
                         cols={this.props.columns} />

                        <FeatureComponent.AddDocument
                            types={this.props.types}
                            addRecord ={this.props.addRecord}
                            getTypeDoc={this.props.getTypeDoc}
                            selectClass="tags-select-small" />
                        <div className={filterClass}>
                            <a href="javascript:void(0)" className="removeFilter">
                                <span className="inside-info">
                                    {filterInfo.method}:&nbsp;{filterInfo.columnName}
                                </span>
                                <span className="close-btn"  onClick={this.props.removeFilter}>
                                    <i className="fa fa-times"></i>
                                </span>
                            </a>
                        </div>
                        <div className={sortClass}>
                            <a href="javascript:void(0)" className="removeFilter">
                                <span className="inside-info">
                                    <i className={sortAscClass}></i> {sortInfo.column}
                                </span>
                                <span className="close-btn"  onClick={this.props.removeSort}>
                                    <i className="fa fa-times"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                </div>
                )
    }
});
// This has the main properties that define the main data table
// i.e. the right side.
var DataTable = React.createClass({
    render: function () {
        var $this = this;
        var data = this.props._data;

        //If render from sort, dont change the order of columns
        if(!$this.props.sortInfo.active){
            if($this.props.infoObj.showing != 0){
                fixed = ['json'];
                columns = ['json'];
            }
            else{
                fixed = [];
                columns = [];
            }

            fullColumns = {
                type:'',
                columns:columns
            }
            for(var each in data){
                fullColumns.type = data[each]['_type'];
                for(column in data[each]){
                    if(fixed.indexOf(column) <= -1 && column != '_id' && column != '_type'){
                        if(fullColumns.columns.indexOf(column) <= -1){
                            fullColumns.columns.push(column);
                        }
                    }
                }
            }
        }
        var rows = [];
        for(var row in data){
            var newRow = {};
            newRow['json'] = data[row]['json'];
            // newRow['_type'] = data[row]['_type'];
            // newRow['_id'] = data[row]['_id'];
            for(var each in columns){
                // We check if every column of the new document
                // is present already, if not we appen to the
                // right.
                if(fixed.indexOf(columns[each]) <= -1){
                    if(data[row][columns[each]]){
                        var cell = data[row][columns[each]];
                        newRow[columns[each]] = cell;
                    }
                    else{
                        // Just to make sure it doesn't display
                        // a null.
                        newRow[columns[each]] = '';
                    }
                }
            }
            renderRow = [];
            for(var each in newRow){
                var _key = keyGen(data[row], each);
                    elem = document.getElementById(each);
                    visibility = '';

                // We see if the column is already closed of open
                // using the html key attribute and render their
                // visibility correspondingly.
                if(elem){
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
            rows.push({'_key': String(data[row]['_id'])+String(data[row]['_type']), 'row':renderRow});
        }
        var renderColumns = fullColumns.columns.map(function(item){
            return (<Column _item={item} key={item}
                        _type={fullColumns.type}
                        _sortInfo={$this.props.sortInfo}
                        handleSort={$this.props.handleSort}
                        mappingObj={$this.props.mappingObj}
                        filterInfo={$this.props.filterInfo} />);
        });
		var visibleColumns = this.props.visibleColumns;

        var renderRows1 = [];

        //If render from sort, dont render the coumns
        var renderRows = rows.map(function(item)
        {
            var _key = item['_key'];
            var row = item['row'];
            return <Row key={_key} _id={_key} row={row} />;
        });

        //Extra add btn
        var extraAddBtn = '';
        //Show only when total records are less than 5
        if(this.props.infoObj.availableTotal <= 5){
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
             <input id="copyId" className="hide" />
            </div>
        );
    }
});

module.exports = DataTable;
