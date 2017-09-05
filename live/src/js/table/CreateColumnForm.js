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
			showError: false,
			valid: false,
			selectedType: this.props.selectedTypes[0]
		};
	}

	getValidationState = () => {
		if (this.state.showError) {
			if (this.state.valid) {
				return 'success';
			}
			return 'error';
		}
		return null;
	}

	handleChange = (e) => {
		if (!this.state.showError) {
			this.setState({
				showError: true
			});
		}
		this.setState({
			[e.target.name]: e.target.value
		}, () => {
			const fields = this.props.mappingObj[this.state.selectedType].properties;
			if (!this.state.value || this.state.value === '_type' || this.state.value === '_id' || Object.prototype.hasOwnProperty.call(fields, this.state.value)) {
				this.setState({
					valid: false
				});
			} else {
				this.setState({
					valid: true
				});
			}
		});
	}

	handleSubmit = () => {
		if (this.state.valid) {
			feed.createMapping(this.state.selectedType, {
				[this.state.selectedType]: {
					properties: {
						[this.state.value]: es2[this.state.type]
					}
				}
			});
			setTimeout(this.props.reloadMapping, 1000);
		}
	}

	render() {
		return (
			<div>
				<h4>Add Field</h4>
				<form>
					<FormGroup
						validationState={this.getValidationState()}
					>
						<FormControl
							type="text"
							value={this.state.value}
							placeholder="Field"
							onChange={this.handleChange}
							name="value"
						/>
						<FormControl.Feedback />
						<HelpBlock>Field name should be unique and not _type or _id</HelpBlock>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Pick the data type</ControlLabel>
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
						<ControlLabel>Configure the type to add this field into</ControlLabel>
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
						disabled={!(this.state.valid)}
						onClick={this.handleSubmit}
					>
						Add
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
