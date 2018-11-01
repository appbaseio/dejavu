// @flow

import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Radio, Row, Col, Button } from 'antd';
import { string, func, object } from 'prop-types';
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

type Props = {
	appname: string,
	mappings: object,
	addMappingRequest: (string, string, string, object) => void,
	indexTypeMap: object,
};

type State = {
	isShowingModal: boolean,
	addColumnError: boolean,
	addColumnField: string,
	isColumnFieldValid: boolean,
	addColumnMapping: string,
	selectedIndex: string,
	types: string[],
	selectedType: string,
	selectedShape: string,
	selectedPrimitiveType: string,
};

class AddFieldModal extends Component<Props, State> {
	state = {
		isShowingModal: false,
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
			this.toggleModal();
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

	toggleModal = () => {
		this.setState(prevState => ({
			isShowingModal: !prevState.isShowingModal,
		}));
	};

	render() {
		const { indexTypeMap } = this.props;
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
			isShowingModal,
		} = this.state;

		return (
			<Fragment>
				<Button
					icon="plus"
					type="primary"
					onClick={this.toggleModal}
					css={{
						marginRight: '5px',
						position: 'absolute',
						top: '104',
						right: '-35px',
						zIndex: 1000,
					}}
				/>
				<Modal
					visible={isShowingModal}
					onCancel={this.toggleModal}
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
					css={{
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
									css={{
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
									css={{
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
								css={{
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
								css={{
									minHeight: '100px',
									maxHeight: '200px',
								}}
							/>
						</Fragment>
					)}
				</Modal>
			</Fragment>
		);
	}
}

AddFieldModal.propTypes = {
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
