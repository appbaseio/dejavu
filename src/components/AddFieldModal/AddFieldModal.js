import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Radio, Row, Col } from 'antd';
import { string, func, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import { getAppname } from '../../reducers/app';
import { getMappings, getIndexTypeMap } from '../../reducers/mappings';
import { addMappingRequest } from '../../actions';
import { es6mappings } from '../../utils/mappings';
import { isVaildJSON } from '../../utils';

import Item from './Item.styles';

const { Option } = Select;
const { Group: RadioGroup } = Radio;

const DATA_SHAPE = ['Primitive', 'Array', 'Object'];
const CUSTOM_MAPPING = 'Custom Mappings';

const customMappings = {
	...es6mappings,
	[CUSTOM_MAPPING]: {},
};

class AddFieldModal extends Component {
	state = {
		addColumnError: false,
		addColumnField: '',
		isColumnFieldValid: true,
		addColumnMapping: `{\n}`,
		selectedIndex: Object.keys(this.props.indexTypeMap)[0],
		types: this.props.indexTypeMap[Object.keys(this.props.indexTypeMap)[0]],
		selectedType: this.props.indexTypeMap[
			Object.keys(this.props.indexTypeMap)[0]
		][0],
		selectedShape: DATA_SHAPE[0],
		selectedPrimitiveType: Object.keys(customMappings)[0],
	};

	handleAfterClose = () => {
		this.setState({
			addColumnError: false,
			addColumnField: '',
			isColumnFieldValid: true,
			addColumnMapping: `{\n}`,
			selectedIndex: Object.keys(this.props.indexTypeMap)[0],
			types: this.props.indexTypeMap[
				Object.keys(this.props.indexTypeMap)[0]
			],
			selectedType: this.props.indexTypeMap[
				Object.keys(this.props.indexTypeMap)[0]
			][0],
			selectedShape: DATA_SHAPE[0],
			selectedPrimitiveType: Object.keys(customMappings)[0],
		});
	};

	handleInputChange = e => {
		const { value } = e.target;
		const { appname, mappings } = this.props;

		this.setState({
			addColumnField: value,
			isColumnFieldValid: !mappings[appname].properties[value],
		});
	};

	handleJsonInput = value => {
		this.setState({
			addColumnError: !isVaildJSON(value),
			addColumnMapping: value,
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
				mappingValue = JSON.parse(addColumnMapping);
			} else {
				mappingValue = es6mappings[selectedPrimitiveType];
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
				afterClose={this.handleAfterClose}
				destroyOnClose
				maskClosable={false}
			>
				<Row>
					<Col span={12}>
						<Item label="Index">
							<Select
								defaultValue={selectedIndex}
								onChange={this.handleIndexChange}
								style={{
									width: '95%',
								}}
							>
								{Object.keys(indexTypeMap).map(index => (
									<Option key={index} value={index}>
										{index}
									</Option>
								))}
							</Select>
						</Item>
					</Col>
					<Col span={12}>
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
					</Col>
				</Row>
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
				{selectedPrimitiveType === CUSTOM_MAPPING && (
					<Fragment>
						<Item label="Mapping" />
						<AceEditor
							tabSize={2}
							mode="json"
							theme="github"
							onChange={this.handleJsonInput}
							name="add-row-modal"
							value={addColumnMapping}
							height="auto"
							width="100%"
							style={{
								minHeight: '100px',
								maxHeight: '200px',
							}}
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
