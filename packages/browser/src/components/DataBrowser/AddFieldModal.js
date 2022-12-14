// @flow

import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Radio, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import { getAppname, getUrl } from '../../reducers/app';
import { getMappings, getIndexTypeMap } from '../../reducers/mappings';
import { addMappingRequest, setAnalyzers } from '../../actions';
import { es6mappings } from '../../utils/mappings';
import { isVaildJSON } from '../../utils';
import labelStyles from '../CommonStyles/label';
import { getAnalyzersApi, closeApp, openApp, putSettings } from '../../apis';
import { getAnalyzers } from '../../reducers/analyzers';
import { getVersion } from '../../reducers/version';
import setMode from '../../actions/mode';
import { MODES } from '../../constants';

import Item from './Item.styles';

const { Option } = Select;
const { Group: RadioGroup } = Radio;

const DATA_SHAPE = ['Primitive', 'Array', 'Object'];
const CUSTOM_MAPPING = "I've my own mappings";

const customMappings = {
	...es6mappings,
	[CUSTOM_MAPPING]: {},
};

type Props = {
	appname: string,
	mappings: object,
	addMappingRequest: (string, string, string, object, number) => void,
	indexTypeMap: object,
	setAnalyzers: (analyzers: any) => void,
	analyzers: string[],
	url: string,
	version: number,
	setMode: string => void,
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
	isProcessing: boolean,
};

class AddFieldModal extends Component<Props, State> {
	state = {
		isShowingModal: false,
		addColumnError: false,
		addColumnField: '',
		isColumnFieldValid: true,
		addColumnMapping: '',
		selectedIndex: Object.keys(this.props.indexTypeMap)[0],
		types: this.props.indexTypeMap[Object.keys(this.props.indexTypeMap)[0]],
		selectedType: this.props.indexTypeMap[
			Object.keys(this.props.indexTypeMap)[0]
		][0],
		selectedShape: DATA_SHAPE[0],
		selectedPrimitiveType: Object.keys(customMappings)[0],
		isProcessing: false,
	};

	handleAfterClose = () => {
		this.setState({
			isShowingModal: false,
			addColumnError: false,
			addColumnField: '',
			isColumnFieldValid: true,
			addColumnMapping: '',
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

	setIsProcessing = value => {
		this.setState({
			isProcessing: value,
		});
	};

	addColumn = async () => {
		try {
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
				selectedIndex &&
				selectedType &&
				selectedShape &&
				selectedPrimitiveType
			) {
				this.setIsProcessing(true);
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
				const {
					analyzers,
					url,
					setAnalyzers: updateAnalyzer,
					version,
				} = this.props;

				let currentAnalyzers = analyzers;
				// check if search field is part of request.
				// if true make sure search analyzers exists.
				if (selectedPrimitiveType === 'Text: Search') {
					currentAnalyzers = await getAnalyzersApi(
						url,
						selectedIndex,
					);

					if (currentAnalyzers.indexOf('ngram_analyzer') === -1) {
						await closeApp(url, selectedIndex);
						await putSettings(url, selectedIndex);
						await openApp(url, selectedIndex);
					}
				}

				this.props.addMappingRequest(
					selectedIndex,
					selectedType,
					addColumnField,
					mappingValue,
					version,
				);

				if (analyzers.indexOf('ngram_analyzer') === -1) {
					updateAnalyzer(['ngram_analyzer', 'autosuggest_analyzer']);
				}
				this.setIsProcessing(false);
				this.toggleModal();
			}
		} catch (err) {
			this.setIsProcessing(false);
			console.error(err);
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
		this.props.setMode(MODES.EDIT);
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
			isProcessing,
		} = this.state;

		return (
			<Fragment>
				<Button
					icon={<PlusOutlined />}
					type="primary"
					onClick={this.toggleModal}
					css={{ marginLeft: 10 }}
				>
					Add Mapping
				</Button>
				<Modal
					open={isShowingModal}
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
							!selectedPrimitiveType ||
							isProcessing,
					}}
					css={{
						top: '10px',
					}}
					className={labelStyles}
					maskClosable={false}
					destroyOnClose
					afterClose={this.handleAfterClose}
				>
					<Row>
						<Col span={12}>
							<Item style={{ marginRight: '15px' }} label="Index">
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
							<Item
								style={{ marginRight: '15px' }}
								label="Document Type"
							>
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
						style={{ margin: '5px 0px' }}
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
					<Item
						style={{ margin: '5px 0px' }}
						label="Select Data Shape"
					>
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
						<Item style={{ margin: '5px 0px' }} label="Data type">
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
							<Item
								style={{ margin: '5px 0px' }}
								label="Custom Mapping Object"
							/>
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
								placeholder={`
								// Example format:
								{
									"type": "date", ...
								}`}
							/>
						</Fragment>
					)}
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	mappings: getMappings(state),
	indexTypeMap: getIndexTypeMap(state),
	analyzers: getAnalyzers(state),
	url: getUrl(state),
	version: getVersion(state),
});

const mapDispatchToProps = {
	addMappingRequest,
	setAnalyzers,
	setMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldModal);
