// @flow

import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Row, Col, Button, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { unflatten } from 'flat';

import 'brace/mode/json';
import 'brace/theme/github';

import {
	getIndexTypeMap,
	getTypePropertyMapping,
} from '../../reducers/mappings';
import { getVersion } from '../../reducers/version';
import { addDataRequest } from '../../actions';
import { isVaildJSON } from '../../utils';
import getSampleData from '../../utils/sampleData';
import labelStyles from '../CommonStyles/label';
import setMode from '../../actions/mode';
import { MODES } from '../../constants';

import Item from './Item.styles';
import Cell from '../Cell';
import Flex from '../Flex';
import MappingsDropdown from '../MappingsDropdown';

const { Option } = Select;
const { TabPane } = Tabs;

type Props = {
	addDataRequest: (string, string, string, any, string, number) => void,
	indexTypeMap: any,
	typePropertyMapping?: {
		[key: string]: any,
	},
	setMode: string => void,
	version: number,
};

type State = {
	isShowingModal: boolean,
	addDataError: boolean,
	addDataValue: string,
	documentId: string,
	selectedIndex: string,
	types: string[],
	selectedType: string,
	tab: string,
	tabData: any,
};

class AddRowModal extends Component<Props, State> {
	state = {
		isShowingModal: false,
		addDataError: false,
		addDataValue: `{\n}`,
		documentId: '',
		selectedIndex: Object.keys(this.props.indexTypeMap)[0],
		types: this.props.indexTypeMap[Object.keys(this.props.indexTypeMap)[0]],
		selectedType: this.props.indexTypeMap[
			Object.keys(this.props.indexTypeMap)[0]
		][0],
		tab: 'json',
		tabData: {},
	};

	componentDidUpdate(prevProps, prevState) {
		const { selectedIndex, selectedType, isShowingModal } = this.state;
		if (
			prevState.selectedIndex !== selectedIndex ||
			prevState.selectedType !== selectedType ||
			prevState.isShowingModal !== isShowingModal
		) {
			this.setSampleData();
		}
	}

	setSampleData = () => {
		const { typePropertyMapping } = this.props;
		const { selectedIndex, selectedType } = this.state;
		// $FlowFixMe
		const properties = typePropertyMapping[selectedIndex][selectedType]
			? // $FlowFixMe
			  typePropertyMapping[selectedIndex][selectedType]
			: {};

		const sampleData = getSampleData(properties);
		this.setState({
			addDataValue: JSON.stringify(unflatten(sampleData), null, 2),
		});
	};

	handleAfterClose = () => {
		this.setState(
			{
				isShowingModal: false,
				addDataError: false,
				addDataValue: `{\n}`,
				documentId: '',
				selectedIndex: Object.keys(this.props.indexTypeMap)[0],
				types: this.props.indexTypeMap[
					Object.keys(this.props.indexTypeMap)[0]
				],
				selectedType: this.props.indexTypeMap[
					Object.keys(this.props.indexTypeMap)[0]
				][0],
				tab: 'json',
				tabData: {},
			},
			() => {
				this.setSampleData();
			},
		);
	};

	handleDocumentIdChange = e => {
		this.setState({
			documentId: e.target.value,
		});
	};

	handleJsonInput = val => {
		this.setState({
			addDataError: !isVaildJSON(val),
			addDataValue: val,
		});
	};

	addValue = () => {
		const { version } = this.props;
		const {
			addDataError,
			addDataValue,
			selectedIndex,
			selectedType,
			tab,
			tabData,
			documentId,
		} = this.state;
		if (!addDataError && selectedIndex && selectedType) {
			let data = {};

			if (tab === 'gui') {
				data = unflatten(tabData);
			} else {
				data = JSON.parse(addDataValue);
			}

			this.props.addDataRequest(
				selectedIndex,
				selectedType,
				documentId,
				data,
				tab,
				version,
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

	toggleModal = () => {
		this.setState(prevState => ({
			isShowingModal: !prevState.isShowingModal,
		}));
		this.props.setMode(MODES.EDIT);
	};

	handleTabChange = tab => {
		this.setState({
			tab,
		});
	};

	handleTabDataChange = (col, value) => {
		this.setState(prevState => ({
			tabData: { ...prevState.tabData, [col]: value },
		}));
	};

	render() {
		const { indexTypeMap, typePropertyMapping } = this.props;
		const {
			addDataError,
			documentId,
			selectedIndex,
			selectedType,
			types,
			addDataValue,
			isShowingModal,
			tab,
			tabData,
		} = this.state;
		// $FlowFixMe
		const properties = typePropertyMapping[selectedIndex][selectedType]
			? // $FlowFixMe
			  typePropertyMapping[selectedIndex][selectedType]
			: {};

		return (
			<Fragment>
				<Button
					icon={<PlusOutlined />}
					type="primary"
					onClick={this.toggleModal}
				>
					Add New Data
				</Button>

				<Modal
					open={isShowingModal}
					onCancel={this.toggleModal}
					onOk={this.addValue}
					okButtonProps={{ disabled: addDataError }}
					css={{
						top: '10px',
					}}
					className={labelStyles}
					destroyOnClose
					maskClosable={false}
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
					<Item label="Document Id">
						<Input
							name="document_id"
							value={documentId}
							onChange={this.handleDocumentIdChange}
							placeholder="Enter document id"
						/>
					</Item>
					<Tabs activeKey={tab} onChange={this.handleTabChange}>
						<TabPane tab="JSON Input" key="json">
							<Flex flexDirection="row">
								<Flex
									flexDirection="column"
									css={{ flex: 0.2 }}
								>
									<Fragment>
										JSON
										<small>
											(use array for adding multiple
											records,{' '}
											<a
												href="https://gist.githubusercontent.com/siddharthlatest/5f580917f575d72dee182caa5b5ed1b3/raw/c0f80b5410f4d7c84d37d49f2d1f5dd11a03a78e/bulk_add_dejavu.json"
												target="_blank" // eslint-disable-line
											>
												see an example.
											</a>
											)
										</small>
									</Fragment>
								</Flex>
								<AceEditor
									tabSize={2}
									mode="json"
									theme="github"
									onChange={this.handleJsonInput}
									name="add-row-modal"
									value={addDataValue}
									height="auto"
									width="100%"
									css={{
										minHeight: '200px',
										maxHeight: '500px',
										flex: 1,
									}}
								/>
							</Flex>
						</TabPane>
						<TabPane tab="Editable View" key="gui">
							<div
								css={{
									maxHeight: '350px',
									overflow: 'auto',
									paddingRight: 15,
								}}
							>
								{Object.keys(properties).map(item => (
									<div
										key={item}
										css={{
											marginTop: '20px',
											border: '1px solid #dfdfdf',
											borderRadius: '4px',
											padding: '10px',
										}}
									>
										<Flex justifyContent="space-between">
											<b>{item}</b>
											{properties[item] && (
												<MappingsDropdown
													mapping={properties[item]}
												/>
											)}
										</Flex>
										<Cell
											mapping={properties[item]}
											onChange={val =>
												this.handleTabDataChange(
													item,
													val,
												)
											}
											active
											mode="edit"
											editable
										>
											{tabData[item] || ''}
										</Cell>
									</div>
								))}
							</div>
						</TabPane>
					</Tabs>
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	indexTypeMap: getIndexTypeMap(state),
	typePropertyMapping: getTypePropertyMapping(state),
	version: getVersion(state),
});

const mapDispatchToProps = {
	addDataRequest,
	setMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRowModal);
