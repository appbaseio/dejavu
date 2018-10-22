import React, { Component } from 'react';
import { Modal, Input, Select, Row, Col } from 'antd';
import { func, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import { getIndexTypeMap } from '../../reducers/mappings';
import { addDataRequest } from '../../actions';
import { isVaildJSON } from '../../utils';

import Item from '../AddFieldModal/Item.styles';

const { Option } = Select;

class AddRowModal extends Component {
	state = {
		addDataError: false,
		addDataValue: `{\n}`,
		documentId: '',
		selectedIndex: Object.keys(this.props.indexTypeMap)[0],
		types: this.props.indexTypeMap[Object.keys(this.props.indexTypeMap)[0]],
		selectedType: this.props.indexTypeMap[
			Object.keys(this.props.indexTypeMap)[0]
		][0],
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
			this.props.toggleModal();
			this.props.addDataRequest(
				selectedIndex,
				selectedType,
				documentId,
				JSON.parse(addDataValue),
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

	render() {
		const { showModal, toggleModal, indexTypeMap } = this.props;
		const {
			addDataError,
			documentId,
			selectedIndex,
			selectedType,
			types,
			addDataValue,
		} = this.state;
		return (
			<Modal
				visible={showModal}
				onCancel={toggleModal}
				onOk={this.addValue}
				okButtonProps={{ disabled: addDataError }}
				style={{
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
					style={{
						minHeight: '200px',
						maxHeight: '300px',
					}}
				/>
			</Modal>
		);
	}
}

AddRowModal.propTypes = {
	showModal: bool.isRequired,
	toggleModal: func.isRequired,
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
