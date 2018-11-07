// @flow

import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Row, Col, Button, Tabs } from 'antd';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import {
	getIndexTypeMap,
	getTypePropertyMapping,
} from '../../reducers/mappings';
import { addDataRequest } from '../../actions';
import { isVaildJSON } from '../../utils';

import Item from './Item.styles';
import Cell from '../Cell';
import Flex from '../Flex';
import MappingsDropdown from '../MappingsDropdown';

const { Option } = Select;
const { TabPane } = Tabs;

type Props = {
	addDataRequest: (string, string, string, object) => void,
	indexTypeMap: object,
	typePropertyMapping?: {
		[key: string]: object,
	},
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
	tabData: object,
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
		const {
			addDataError,
			addDataValue,
			selectedIndex,
			selectedType,
			documentId,
			tab,
			tabData,
		} = this.state;
		if (!addDataError && selectedIndex && selectedType && documentId) {
			let data = {};

			if (tab === 'gui') {
				data = tabData;
			} else {
				data = addDataValue;
			}

			this.props.addDataRequest(
				selectedIndex,
				selectedType,
				documentId,
				data,
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
					icon="plus"
					type="primary"
					onClick={this.toggleModal}
					css={{ position: 'absolute !important', bottom: -40 }}
				>
					Add New Row
				</Button>

				<Modal
					visible={isShowingModal}
					onCancel={this.toggleModal}
					onOk={this.addValue}
					okButtonProps={{ disabled: addDataError }}
					css={{
						top: '10px',
					}}
					destroyOnHide
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
							<Item label="Document Type">
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
							<Item label="JSON document" />
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
									maxHeight: '300px',
								}}
							/>
						</TabPane>
						<TabPane tab="Editable View" key="gui">
							<div
								css={{
									maxHeight: '350px',
									overflow: 'auto',
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

AddRowModal.propTypes = {
	addDataRequest: func.isRequired,
	indexTypeMap: object.isRequired,
	typePropertyMapping: object,
};

const mapStateToProps = state => ({
	indexTypeMap: getIndexTypeMap(state),
	typePropertyMapping: getTypePropertyMapping(state),
});

const mapDispatchToProps = {
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddRowModal);
