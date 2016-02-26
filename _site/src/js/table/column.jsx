var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FilterDropdown = require('./filterDropdown.jsx');

var cellWidth = '250px';
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;
        
var Column = React.createClass({
    getInitialState: function() {
        return {
            type: null
        };
    },
    sortingInit: function() {
        this.props.handleSort(this.props._item, this.props._type, this);
    },
    componentDidMount: function() {
        this.setState({
            type: this.props._type
        });
    },
    render: function() {
        
        var item = this.props._item;
        var type = this.state.type == null ? this.props._type : this.state.type;
        var sortInfo = this.props._sortInfo;
        var filterInfo = this.props.filterInfo;

        var filterClass = filterInfo.active && filterInfo.columnName == item ? 'filterActive' : '';
        var extraClass = sortInfo.column == item ? 'sortActive ' + sortInfo.reverse : '';
        var fixedHead = 'table-fixed-head column_width ' + extraClass + ' ' + filterClass;
        var filterId = 'filter-' + item;
        var datatype = null;
        var analyzed = true;
        prettyData = " Clicking on {...} displays the JSON data. ";
        var itemText = item == 'json' ? 
                (<span>
                    <OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson jsonTitle">{prettyData}</Popover>}>
                        <a href="javascript:void(0);" className="bracketIcon"></a>
                    </OverlayTrigger>
                    <span>&nbsp;&nbsp;type / id</span>
                </span>) : 
                (<span onClick={this.sortingInit}>{item}
                </span>);
        var thtextShow = item == 'json' ? 'leftGap thtextShow' : 'thtextShow';
        
        //get the datatype if field is not json & type mapping has properties field
        try {
            if (item != 'json' && this.props.mappingObj[type].hasOwnProperty('properties') && typeof this.props.mappingObj[type] != 'undefined' && typeof this.props.mappingObj[type]['properties'][item] != 'undefined') {
                datatype = this.props.mappingObj[type]['properties'][item].type;
                analyzed = this.props.mappingObj[type]['properties'][item].index == 'not_analyzed' ? false : true;
            }
        }
        catch(err) {
            console.log(err);
        }

        //Allow sorting if item is not the first column
        //here first column is  json = type/id
        var sortIcon = item == 'json' ? <span></span> : <span className="sortIcon"  onClick={this.sortingInit}>
                                            <i className ="fa fa-chevron-up asc-icon" />
                                            <i className ="fa fa-chevron-down desc-icon" />
                                        </span>;
        //console.log(datatype, item);
        //var handleSort = this.sortingInit;

        return (<th id={item} width={cellWidth} className="tableHead">
                    <div className={fixedHead}>
                        <div className="headText">
                            <div className={thtextShow}>
                                {itemText}
                            </div>
                            <div className="iconList">
                                {sortIcon}
                                <span className="filterIcon">
                                    <FilterDropdown columnField={item} type={type} datatype = {datatype} analyzed={analyzed} filterInfo={this.props.filterInfo} />
                                </span>
                            </div>
                        </div>
                    </div>
                </th>);
    }
});

module.exports = Column;
