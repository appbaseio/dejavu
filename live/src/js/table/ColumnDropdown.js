var React = require('react');
import { Dropdown, MenuItem } from 'react-bootstrap';
var FieldCheckbox = require('./FieldCheckbox.js');

/*
 * This file contains the utility components, mainly the dropdown menu for
 * selecting which fields to apphear in the table, also the checkboxes component
 * for selecting and deselecting the columns(rendered inside the dropdown).
 */

class ColumnDropdown extends React.Component {
	render() {
		var $this = this;
		var columns = this.props.cols ? this.props.cols : [] ;
		// We'll get the dropdown menu items i.e. checkboxes
		// as a list of react components i.e FieldCheckbox.
		var ColumnsCheckbox = columns.map((item, i) => {
			var key = dropdownKeyGen(item);
			if (item !== 'json') {
				return (
					<FieldCheckbox
						columnToggle={$this.props.columnToggle}
						key={i}
						_type={item}
						_key={key}
						checked={this.props.visibleColumns.includes(item)}
					/>
				);
			}
		});
		return (
			<Dropdown
				className="dejavu-dropdown pull-right "
				pullRight={true}
				id='ab-dropdown'
			>
			<Dropdown.Toggle className="fa fa-cog" />
			<Dropdown.Menu>
				<MenuItem header className='centered-text'>Displayed Attributes</MenuItem>
				<MenuItem divider/>
				{ColumnsCheckbox}
			</Dropdown.Menu>
			</Dropdown>
		);
	}
}

module.exports = ColumnDropdown;
