import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

/* global feed */
import { es2 } from '../helper/esMapping';

class CreateColumnForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			type: 'Text',
			selectedType: this.props.selectedTypes[0]
		};
	}

	getValidationState = () => {
		if (this.state.value.length) {
			return 'success';
		}
		return 'error';
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	render() {
		return (
			<div>
				<h4>Create new field</h4>
				<form>
					<FormGroup
						validationState={this.getValidationState()}
					>
						<ControlLabel>Enter new field name</ControlLabel>
						<FormControl
							type="text"
							value={this.state.value}
							placeholder="Field"
							onChange={this.handleChange}
							name="value"
						/>
						<FormControl.Feedback />
						<HelpBlock>Field name should be a valid string.</HelpBlock>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Select new field type</ControlLabel>
						<FormControl
							componentClass="select"
							placeholder="Select ES Type"
							value={this.state.type}
							onChange={this.handleChange}
							name="type"
						>
							{
								Object.keys(es2).map(item => (
									<option key={item} value={item}>{item}</option>
								))
							}
						</FormControl>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Select type to add this field to</ControlLabel>
						<FormControl
							componentClass="select"
							placeholder="Select Type"
							value={this.state.selectedType}
							onChange={this.handleChange}
							name="selectedType"
						>
							{
								this.props.selectedTypes.map(item => (
									<option key={item} value={item}>{item}</option>
								))
							}
						</FormControl>
					</FormGroup>
					<Button
						bsStyle="primary"
						disabled={!(this.state.value && this.state.type)}
						onClick={() => {
							feed.createMapping(this.state.selectedType, {
								[this.state.selectedType]: {
									properties: {
										[this.state.value]: es2[this.state.type]
									}
								}
							});
							setTimeout(this.props.reloadMapping, 1000);
						}}
					>
						Create!
					</Button>
				</form>
			</div>
		);
	}
}

CreateColumnForm.propTypes = {
	selectedTypes: PropTypes.arrayOf(PropTypes.string),
	reloadMapping: PropTypes.func
};

export default CreateColumnForm;
