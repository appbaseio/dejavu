import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

/* global feed */
import { es2, dateFormats } from '../helper/esMapping';
import ErrorModal from '../features/ErrorModal';

class CreateColumnForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			type: 'Text',
			format: 'YYYY/MM/DD',
			showError: false,
			valid: false,
			selectedType: this.props.selectedTypes[0],
			credentialsError: false,
			credentialsErrorMessage: ''
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
		if (!this.state.showError && e.target.name === 'value') {
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

	handleCredentialsErrorMsg = (e) => {
		if (e.status >= 400) {
			this.setState({
				credentialsError: true,
				credentialsErrorMessage: e.message
			});
		}
	}

	hideCredentialsErrorMessage= () => {
		this.setState({
			credentialsError: false,
			credentialsErrorMessage: ''
		});
	}

	handleSubmit = () => {
		if (this.state.valid) {
			const mapping = this.state.type === 'Date' ?
			{
				...es2[this.state.type],
				format: this.state.format
			} :
			es2[this.state.type];
			feed.createMapping(this.state.selectedType, {
				[this.state.selectedType]: {
					properties: {
						[this.state.value]: mapping
					}
				}
			}, this.handleCredentialsErrorMsg);
			setTimeout(this.props.reloadMapping, 1000);
		}
	}

	render() {
		return (
			<div>
				<ErrorModal
					errorShow={this.state.credentialsError}
					errorMessage={this.state.credentialsErrorMessage}
					closeErrorModal={this.hideCredentialsErrorMessage}
				/>
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
					{
						this.state.type === 'Date' &&
						<FormGroup>
							<ControlLabel>Pick the date format</ControlLabel>
							<FormControl
								componentClass="select"
								placeholder="Select Date Format"
								value={this.state.format}
								onChange={this.handleChange}
								name="format"
							>
								{
									dateFormats.map(item => (
										<option key={item} value={item}>{item}</option>
									))
								}
							</FormControl>
						</FormGroup>
					}
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
