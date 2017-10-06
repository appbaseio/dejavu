import React from 'react';	// eslint-disable-line
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Radio, OverlayTrigger, Tooltip } from 'react-bootstrap';

/* global feed, help */
import { es2, es5, dateFormats, dateHints } from '../helper/esMapping';
import ErrorModal from '../features/ErrorModal';

const customMapping = "I’ve my own mapping"; // eslint-disable-line

class CreateColumnForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			type: 'Text',
			complexData: 'default',
			format: 'epoch_millis',
			showError: false,
			valid: false,
			selectedType: this.props.selectedTypes[0],
			credentialsError: false,
			credentialsErrorTitle: '',
			credentialsErrorMessage: '',
			isMappingValid: true,
			esMapping: feed.getEsVersion() === 2 ? es2 : es5
		};
	}

	componentDidMount() {
		const nextEsMapping = { ...this.state.esMapping };
		this.setState({	// eslint-disable-line
			esMapping: {
				...nextEsMapping,
				[customMapping]: 'customMapping'
			}
		});
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

	isValidJSON = () => {
		const mappingObj = this.editorref.getValue().trim();
		try {
			JSON.parse(mappingObj);
		} catch (e) {
			return false;
		}
		if (mappingObj === '{}') {
			return false;
		}
		return true;
	}

	handleChange = (e) => {
		const { name } = e.target;
		const { value } = e.target;
		const prevComplexData = this.state.complexData;
		if (!this.state.showError && name === 'value') {
			this.setState({
				showError: true
			});
		}
		this.setState({
			[name]: value
		}, () => {
			const fields = this.props.selectedTypes.reduce((allFields, currentType) => {
				if (this.props.mappingObj[currentType].properties) {
					return { ...allFields, ...this.props.mappingObj[currentType].properties };
				}
				return { ...allFields };
			}, {});
			if (
				!this.state.value ||
				this.state.value === '_type' ||
				this.state.value === '_id' ||
				Object.prototype.hasOwnProperty.call(fields, this.state.value) ||
				/[^A-Za-z0-9_#.$]/g.test(this.state.value)
			) {
				this.setState({
					valid: false
				});
			} else {
				this.setState({
					valid: true
				});
			}
			if (
				(name === 'type' && value === customMapping) ||
				// need to set codemirror again if switching to and fro object or image type
				(name === 'complexData' && value !== 'object' && this.state.type === customMapping && prevComplexData === 'object')
			) {
				this.editorref = help.setCodeMirror('custom-mapping-textarea');
				this.props.toggleExpand(true);
			} else if (name === 'type' && value !== customMapping) {
				this.props.toggleExpand(false);
			}
		});
	}

	handleCredentialsErrorMsg = (e) => {
		if (e.status >= 400) {
			if (e.error) {
				const { type, reason } = e.error;
				this.setState({
					credentialsError: true,
					credentialsErrorTitle: type,
					credentialsErrorMessage: reason
				});
			} else {
				this.setState({
					credentialsError: true,
					credentialsErrorMessage: e.message
				});
			}
		}
	}

	hideCredentialsErrorMessage = () => {
		this.setState({
			credentialsError: false,
			credentialsErrorMessage: ''
		});
	}

	handleSubmit = () => {
		if (this.state.valid) {
			let mapping = this.state.type === 'Date' ?
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

			if (this.state.type === 'Image') {
				if (Object.prototype.hasOwnProperty.call(meta, 'dejavuMeta')) {
					meta.dejavuMeta[this.state.value] = 'image';
				} else {
					meta.dejavuMeta = {
						[this.state.value]: 'image'
					};
				}
			}

			if (this.state.complexData !== 'default') {
				if (Object.prototype.hasOwnProperty.call(meta, 'dejavuMeta')) {
					meta.dejavuMeta[this.state.value] = this.state.complexData + (this.state.type === 'Image' ? '-image' : '');
				} else {
					meta.dejavuMeta = {
						[this.state.value]: this.state.complexData + (this.state.type === 'Image' ? '-image' : '')
					};
				}
			}

			if (this.state.type === customMapping) {
				if (this.isValidJSON()) {
					if (!this.state.isMappingValid) {
						this.setState({
							isMappingValid: true
						});
					}
					mapping = JSON.parse(this.editorref.getValue().trim());
				} else {
					this.setState({
						isMappingValid: false
					});
					return;
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
			setTimeout(this.props.reloadData, 1000);
		}
	}


	render() {
		return (
			<div className="create-column-form-container">
				<ErrorModal
					errorShow={this.state.credentialsError}
					errorTitle={this.state.credentialsErrorTitle}
					errorMessage={this.state.credentialsErrorMessage}
					closeErrorModal={this.hideCredentialsErrorMessage}
				/>
				<div className="flex-row flex-baseline">
					<h4>Add Field</h4><span className="pad-left">(aka Column)</span>
				</div>
				<form>
					<div className="flex-row">
						<FormGroup bsClass="create-column-estype">
							<ControlLabel>Elasticsearch Type</ControlLabel>
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
						<FormGroup
							validationState={this.getValidationState()}
						>
							<ControlLabel>Field Name</ControlLabel>
							<FormControl
								type="text"
								value={this.state.value}
								placeholder="Field"
								onChange={this.handleChange}
								name="value"
							/>
							<FormControl.Feedback />
							<HelpBlock>Should be unique and not _type or _id (_#.$ are allowed)</HelpBlock>
						</FormGroup>
					</div>
					<FormGroup>
						<ControlLabel>
							Pick the data shape&nbsp;
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip id="tooltip-explaination">Determines whether the field can hold one or multiple values</Tooltip>}
							>
								<i className="fa fa-info-circle" />
							</OverlayTrigger>
						</ControlLabel>
						<FormGroup>
							<Radio name="complexData" value="default" inline onChange={this.handleChange} checked={this.state.complexData === 'default'}>
								Primitive
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
					</FormGroup>
					{
						this.state.complexData !== 'object' &&
						<FormGroup>
							<ControlLabel>Data Type</ControlLabel>
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
					}
					{
						this.state.type === 'Date' && this.state.complexData !== 'object' &&
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
										<option key={item} value={item}>{`${item} ${dateHints[item] || ''}`}</option>
									))
								}
							</FormControl>
						</FormGroup>
					}
					{
						this.state.type === customMapping && this.state.complexData !== 'object' &&
						<div className="custom-mapping-textarea">
							<div>
								<h5>Custom Mapping Object</h5>
								<textarea id="custom-mapping-textarea" rows="7" />
							</div>
							{
								!this.state.isMappingValid &&
								<div>
									<span className="alert-message">Mapping object should be a valid JSON</span>
								</div>
							}
						</div>
					}
					<Button
						bsStyle="primary"
						bsClass="btn btn-primary create-column-submit-btn"
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
	mappingObj: PropTypes.object,	// eslint-disable-line
	toggleExpand: PropTypes.func,
	reloadData: PropTypes.func
};

export default CreateColumnForm;
