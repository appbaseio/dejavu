import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Radio } from 'react-bootstrap';

/* global feed */
import { es2, es5, dateFormats } from '../helper/esMapping';
import ErrorModal from '../features/ErrorModal';

class CreateColumnForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			type: 'Text',
			complexData: 'default',
			format: 'YYYY/MM/DD',
			showError: false,
			valid: false,
			selectedType: this.props.selectedTypes[0],
			credentialsError: false,
			credentialsErrorMessage: '',
			esMapping: feed.getEsVersion() === 2 ? es2 : es5
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
				...this.state.esMapping[this.state.type],
				format: this.state.format
			} :
			this.state.esMapping[this.state.type];
			const meta = this.props.mappingObj[this.state.selectedType]._meta ?
			{ ...this.props.mappingObj[this.state.selectedType]._meta } :
			{
				dejavuMeta: {}
			};

			if (this.state.complexData !== 'default') {
				if (Object.prototype.hasOwnProperty.call(meta, 'dejavuMeta')) {
					meta.dejavuMeta[this.state.value] = this.state.complexData;
				} else {
					meta.dejavuMeta = {
						[this.state.value]: this.state.complexData
					};
				}
			}

			// for an object type assign no mapping
			const properties = this.state.complexData === 'object' ?
			{} :
			{
				properties: {
					[this.state.value]: mapping
				}
			};

			feed.createMapping(this.state.selectedType, {
				[this.state.selectedType]: {
					_meta: meta,
					...properties
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
								Object.keys(this.state.esMapping).map(item => (
									<option key={item} value={item}>{item}</option>
								))
							}
						</FormControl>
					</FormGroup>
					{
						(this.state.type === 'Text' || this.state.type === 'SearchableText') &&
						<FormGroup>
							<Radio name="complexData" value="default" inline onChange={this.handleChange} checked={this.state.complexData === 'default'}>
								Default
							</Radio>
							{' '}
							<Radio name="complexData" value="array" inline onChange={this.handleChange} checked={this.state.complexData === 'array'}>
								Array
							</Radio>
							{' '}
							<Radio name="complexData" value="object" inline onChange={this.handleChange} checked={this.state.complexData === 'object'}>
								Object
							</Radio>
						</FormGroup>
					}
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
	reloadMapping: PropTypes.func,
	mappingObj: PropTypes.object	// eslint-disable-line
};

export default CreateColumnForm;
