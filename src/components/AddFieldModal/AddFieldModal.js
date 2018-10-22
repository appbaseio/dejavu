import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Radio } from 'antd';
import { string, func, bool, object } from 'prop-types';
import JsonInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { connect } from 'react-redux';

import { getAppname } from '../../reducers/app';
import { getMappings, getIndexTypeMap } from '../../reducers/mappings';
import { addMappingRequest } from '../../actions';
import esMappings from '../../utils/mappings';

import Item from './Item.styles';

const { Option } = Select;
const { Group: RadioGroup } = Radio;

const DATA_SHAPE = ['Primitive', 'Array', 'Object'];
const CUSTOM_MAPPING = 'Custom Mappings';

const customMappings = {
	...esMappings,
	[CUSTOM_MAPPING]: {},
};

class AddFieldModal extends Component {
	state = {
		addColumnError: false,
		addColumnField: '',
		isColumnFieldValid: true,
		addColumnMapping: {},
		selectedIndex: Object.keys(this.props.indexTypeMap)[0],
		types: this.props.indexTypeMap[Object.keys(this.props.indexTypeMap)[0]],
		selectedType: this.props.indexTypeMap[
			Object.keys(this.props.indexTypeMap)[0]
		][0],
		selectedShape: DATA_SHAPE[0],
		selectedPrimitiveType: Object.keys(customMappings)[0],
	};

	handleInputChange = e => {
		const { value } = e.target;
		const { appname, mappings } = this.props;

		this.setState({
			addColumnField: value,
			isColumnFieldValid: !mappings[appname].properties[value],
		});
	};

	handleJsonInput = ({ error, jsObject }) => {
		this.setState({
			addColumnError: Boolean(error),
			addColumnMapping: jsObject,
		});
	};

	addColumn = () => {
		const {
			addColumnError,
			addColumnField,
			addColumnMapping,
			selectedIndex,
			selectedPrimitiveType,
			selectedType,
			selectedShape,
		} = this.state;
		if (
			!addColumnError &&
			addColumnField &&
			addColumnMapping &&
			selectedIndex &&
			selectedType &&
			selectedShape &&
			selectedPrimitiveType
		) {
			this.props.toggleModal();
			let mappingValue = null;

			if (selectedShape === 'Object') {
				mappingValue = {
					type: 'object',
				};
			} else if (selectedPrimitiveType === CUSTOM_MAPPING) {
				mappingValue = addColumnMapping;
			} else {
				mappingValue = esMappings[selectedPrimitiveType];
			}

			this.props.addMappingRequest(
				selectedIndex,
				selectedType,
				addColumnField,
				mappingValue,
			);
		}
	};

	handleIndexChange = selectedIndex => {
		this.setState({
			selectedIndex,
			types: this.props.indexTypeMap[selectedIndex],
			selectedType: this.props.indexTypeMap[selectedIndex][0],
		});
	};

	handleTypeChange = selectedType => {
		this.setState({
			selectedType,
		});
	};

	handleShapeChange = e => {
		this.setState({
			selectedShape: e.target.value,
		});
	};

	handlePrimitiveTypeChange = selectedPrimitiveType => {
		this.setState({
			selectedPrimitiveType,
		});
	};

	render() {
		const { showModal, toggleModal, indexTypeMap } = this.props;
		const {
			addColumnError,
			addColumnField,
			isColumnFieldValid,
			selectedIndex,
			selectedType,
			selectedShape,
			selectedPrimitiveType,
			addColumnMapping,
			types,
		} = this.state;

		return (
			<Modal
				visible={showModal}
				onCancel={toggleModal}
				onOk={this.addColumn}
				okButtonProps={{
					disabled:
						addColumnError ||
						!addColumnField ||
						!isColumnFieldValid ||
						!selectedIndex ||
						!selectedType ||
						!selectedShape ||
						!selectedPrimitiveType,
				}}
				style={{
					top: '10px',
				}}
				destroyOnClose
				maskClosable={false}
			>
				<Item label="Index">
					<Select
						defaultValue={selectedIndex}
						onChange={this.handleIndexChange}
						style={{
							width: '100%',
						}}
					>
						{Object.keys(indexTypeMap).map(index => (
							<Option key={index} value={index}>
								{index}
							</Option>
						))}
					</Select>
				</Item>
				<Item label="Type">
					<Select
						value={selectedType}
						onChange={this.handleTypeChange}
						style={{
							width: '100%',
						}}
					>
						{types.map(type => (
							<Option key={type} value={type}>
								{type}
							</Option>
						))}
					</Select>
				</Item>
				<Item label="Select data shape">
					<RadioGroup
						onChange={this.handleShapeChange}
						value={selectedShape}
					>
						{DATA_SHAPE.map(shape => (
							<Radio key={shape} value={shape}>
								{shape}
							</Radio>
						))}
					</RadioGroup>
				</Item>
				{selectedShape !== 'Object' && (
					<Item label="Data type">
						<Select
							defaultValue={selectedPrimitiveType}
							onChange={this.handlePrimitiveTypeChange}
							style={{
								width: '100%',
							}}
						>
							{Object.keys(customMappings).map(mapping => (
								<Option key={mapping} value={mapping}>
									{mapping}
								</Option>
							))}
						</Select>
					</Item>
				)}
				<Item
					label="Field Name"
					hasFeedback
					validateStatus={isColumnFieldValid ? '' : 'error'}
					help={!isColumnFieldValid && 'Duplicate field name'}
				>
					<Input
						name="addColumnField"
						value={addColumnField}
						onChange={this.handleInputChange}
						placeholder="Enter Field Name"
					/>
				</Item>
				{selectedPrimitiveType === CUSTOM_MAPPING && (
					<Fragment>
						<Item label="Mapping" />
						<JsonInput
							id="add-row-modal"
							locale={locale}
							theme="light_mitsuketa_tribute"
							height="150px"
							placeholder={addColumnMapping}
							style={{
								outerBox: {
									marginTop: 20,
								},
							}}
							onChange={this.handleJsonInput}
						/>
					</Fragment>
				)}
			</Modal>
		);
	}
}

AddFieldModal.propTypes = {
	showModal: bool.isRequired,
	toggleModal: func.isRequired,
	appname: string.isRequired,
	mappings: object,
	addMappingRequest: func.isRequired,
	indexTypeMap: object.isRequired,
};

const mapStateToProps = state => ({
	appname: getAppname(state),
	mappings: getMappings(state),
	indexTypeMap: getIndexTypeMap(state),
});

const mapDispatchToProps = {
	addMappingRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddFieldModal);
