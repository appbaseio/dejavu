import React from 'react';

class FieldCheckbox extends React.Component {
	constructor(props) {
		super(props);
		var elemID = props._type;
		var checked = true;
		var elem = document.getElementById(elemID);
		if (elem && elem.style.display === "none") {
			checked = false;
		}
		this.state = {
			isChecked: checked
		};
	}
	// This is the on-click handler for the checkboxes
	// when we check/uncheck a checkbox, all the elements
	// which belong to that column should be visible/invisible
	// we do this by assigning specific keys to them. check KeyGen.
	check(elementId) {
		var checked = true;
		if (elementId == 'type / id') {
			elementId = 'json';
		}
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
	}

	render() {
		var key = dropdownKeyGen(this.props._type);
		return (
			<div className='ab-menu-item'>
				<div className="checkbox theme-element">
					<input
					id={key}
					type="checkbox" key={key}
					checked={this.props.checked}
					onChange={this.check.bind(this, this.props._type)} readOnly={false}/>
					<label htmlFor={key}> {this.props._type} </label>
				</div>
			</div>
		);
	}
}

module.exports = FieldCheckbox;
