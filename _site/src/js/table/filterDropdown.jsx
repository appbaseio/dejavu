var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var SingleMenuItem = require('./SingleMenuItem.jsx');


//Filter dropdown for each column header
var FilterDropdown = React.createClass({
    getInitialState: function() {
        return {
            filterField: null,
            filterValue: null
        };
    },
    changeFilter: function(field, value) {
        this.setState({
            filterField: field,
            filterValue: value
        });
    },
    getFilterVal: function(val) {
        this.setState({
            filterValue: val
        });
    },
    applyFilter: function() {
        if (this.state.filterField != null && this.state.filterValue != null && this.state.filterValue != '')
            this.props.filterInfo.applyFilter(this.props.type, this.props.columnField, this.state.filterField, this.state.filterValue, this.props.analyzed);
    },
    render: function() {
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
                                    <SingleMenuItem  columnField={this.props.columnField} filterField={this.state.filterField} changeFilter={this.changeFilter} datatype={datatype} getFilterVal={this.getFilterVal} val="range" />
                                    <div className="singleItem">
                                        <button className='btn btn-info col-xs-12' onClick={this.applyFilter}>Apply</button>
                                    </div>
                                </Dropdown.Menu>
        );

        var FilterMenuItems = '';

        switch (datatype) {
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

        if (datatype == null) {
            return (<span></span>);
        } else {
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

module.exports = FilterDropdown;