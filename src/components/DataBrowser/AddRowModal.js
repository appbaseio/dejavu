import React, { Component, Fragment } from 'react';
import { Modal, Input, Select, Row, Col, Button } from 'antd';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import { getIndexTypeMap } from '../../reducers/mappings';
import { addDataRequest } from '../../actions';
import { isVaildJSON } from '../../utils';

import Item from './Item.styles';

const { Option } = Select;

class AddRowModal extends Component {
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
	};

	handleAfterClose = () => {
		this.setState({
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
		});
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
		} = this.state;
		if (
			!addDataError &&
			addDataValue &&
			selectedIndex &&
			selectedType &&
			documentId
		) {
			this.props.addDataRequest(
				selectedIndex,
				selectedType,
				documentId,
				JSON.parse(addDataValue),
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

	render() {
		const { indexTypeMap } = this.props;
		const {
			addDataError,
			documentId,
			selectedIndex,
			selectedType,
			types,
			addDataValue,
			isShowingModal,
		} = this.state;
		return (
			<Fragment>
				<Button icon="table" type="primary" onClick={this.toggleModal}>
					Add New Row
				</Button>

				<Modal
					visible={isShowingModal}
					onCancel={this.toggleModal}
					afterClose={this.handleAfterClose}
					onOk={this.addValue}
					okButtonProps={{ disabled: addDataError }}
					css={{
						top: '10px',
					}}
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
					<Item label="Document Id">
						<Input
							name="document_id"
							value={documentId}
							onChange={this.handleDocumentIdChange}
							placeholder="Enter document id"
						/>
					</Item>
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
				</Modal>
			</Fragment>
		);
	}
}

AddRowModal.propTypes = {
	addDataRequest: func.isRequired,
	indexTypeMap: object.isRequired,
};

const mapStateToProps = state => ({
	indexTypeMap: getIndexTypeMap(state),
});

const mapDispatchToProps = {
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddRowModal);
