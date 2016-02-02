var React = require('react');
var ReactBootstrap = require('react-bootstrap');
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

// The problem with checkboxes in bootstrap and react-bootstrap while using
// them in react is that if you keep the fields checked by default, the don't
// uncheck like I mean forever. This is an issue in the react-bootstrap.
var FieldCheckbox = React.createClass({
    getInitialState: function() {
        var elemID = this.props._type;
        var checked = true;
        var elem = document.getElementById(elemID);
        // the elem here is the column header i.e the type.
        // If its not visible, keep the checkbox by default
        // unckecked. This is useful when you want to preserve
        // your state even after refresh.
        if (!elem)
            return {
                isChecked: checked
            };
        if (elem.style.display === "none") {
            checked = false;
        }
        return {
            isChecked: checked
        };
    },
    // This is the on-click handler for the checkboxes
    // when we check/uncheck a checkbox, all the elements
    // which belong to that column should be visible/invisible
    // we do this by assigning specific keys to them. check KeyGen.
    check: function(elementId, event) {
        var checked = true;
        if (elementId == 'type / id')
            elementId = 'json';
        if (document.getElementById(elementId).style.display === "none") {
            document.getElementById(elementId).style.display = "";
            checked = true;

            // we iterate through all the cells in that column via
            // their id and then change their visibility.
            for (var each in sdata) {
                var key = keyGen(sdata[each], elementId);
                document.getElementById(key).style.display = ""
            }
        } else {
            document.getElementById(elementId).style.display = "none";
            checked = false;

            for (var each in sdata) {
                var key = keyGen(sdata[each], elementId);
                document.getElementById(key).style.display = "none"
            }
        }
        this.setState({
            isChecked: checked
        });
        this.props.columnToggle().toggleIt(elementId, checked);
    },
    render: function() {
        var Input = ReactBootstrap.Input;
        var key = dropdownKeyGen(this.props._type);
        return (
            <div className='ab-menu-item'>
                <div className="checkbox theme-element">
                    <input 
                    id={key} 
                    type="checkbox" key={key}
                    defaultChecked={this.state.isChecked} 
                    onChange={this.check.bind(null, this.props._type)} readOnly={false}/>
                    <label htmlFor={key}> {this.props._type} </label>
                </div>
            </div>
        );
    }
});

module.exports = Dropdown;