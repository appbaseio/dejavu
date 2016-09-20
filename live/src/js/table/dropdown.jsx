var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FieldCheckbox = require('./FieldCheckbox.jsx');
/*
 * This file contains the utility components, mainly the dropdown menu for
 * selecting which fields to apphear in the table, also the checkboxes component
 * for selecting and deselecting the columns(rendered inside the dropdown).
 */

var Dropdown = React.createClass({
    render: function() {
        var $this = this;
        var Dropdown = ReactBootstrap.Dropdown;
        var columns = this.props.cols;
        var MenuItem = ReactBootstrap.MenuItem;
        // We'll get the dropdown menu items i.e. checkboxes
        // as a list of react components i.e FieldCheckbox.
        var ColumnsCheckbox = columns.map(function(item, i) {
            var key = dropdownKeyGen(item);
            if (item != 'json')
                return <FieldCheckbox columnToggle ={$this.props.columnToggle} key={i} _type={item} _key={this.key}/>;
        });
        return (
            <Dropdown
            className="dejavu-dropdown pull-right "
            pullRight={true}
            noCaret
            id='ab-dropdown'>
            <Dropdown.Toggle className='fa fa-cog' noCaret/>
            <Dropdown.Menu>
                <MenuItem header className='centered-text'>Displayed Attributes</MenuItem>
                <MenuItem divider/>
                {ColumnsCheckbox}
            </Dropdown.Menu>
            </Dropdown>
        );
    }
});

module.exports = Dropdown;
