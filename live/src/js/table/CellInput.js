import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CellInput extends Component {
	componentDidMount() {
		this.inputRef.focus();
	}

	render() {
		return (
			<input
				ref={(node) => { this.inputRef = node; }}
				type="text"
				value={this.props.value}
				onChange={e => this.props.handleChange(e)}
				onBlur={this.props.handleBlur}
				className="cell-input"
			/>
		);
	}
}

CellInput.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]).isRequired,
	handleChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired
};

export default CellInput;
