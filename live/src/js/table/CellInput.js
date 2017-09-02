import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

class CellInput extends Component {
	componentDidMount() {
		this.inputRef.focus();
	}

	render() {
		return (
			<OverlayTrigger
				placement="top"
				overlay={
					this.props.showTooltip ?
						<Tooltip id="tooltip-field-number">{this.props.tooltipText}</Tooltip> :
						<Tooltip id="tooltip-field-string" bsClass="tooltip-hidden" />
				}
				delay={800}
			>
				{
					this.props.singleLine ?
						<input
							name={this.props.name}
							ref={(node) => { this.inputRef = node; }}
							type="text"
							value={this.props.value}
							onChange={e => this.props.handleChange(e)}
							onBlur={this.props.handleBlur}
							className="cell-input-single"
						/> :
						<textarea
							name={this.props.name}
							ref={(node) => { this.inputRef = node; }}
							type="text"
							value={this.props.value}
							onChange={e => this.props.handleChange(e)}
							onBlur={this.props.handleBlur}
							className="cell-input"
						/>
				}
			</OverlayTrigger>
		);
	}
}

CellInput.propTypes = {
	name: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]).isRequired,
	handleChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired,
	showTooltip: PropTypes.bool,
	tooltipText: PropTypes.string,
	singleLine: PropTypes.bool
};

CellInput.defaultProps = {
	showTooltip: false,
	tooltipText: 'This field should be a number',
	singleLine: false
};

export default CellInput;
