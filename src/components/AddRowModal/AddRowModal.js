import React, { Component } from 'react';
import { Modal, Input, Select } from 'antd';
import { func, bool, object } from 'prop-types';
import JsonInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { connect } from 'react-redux';

import { getIndexTypeMap } from '../../reducers/mappings';
import { addDataRequest } from '../../actions';

import Item from '../AddFieldModal/Item.styles';

const { Option } = Select;

class AddRowModal extends Component {
	state = {
		addDataError: false,
		addDataValue: {},
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

	handleJsonInput = ({ error, jsObject }) => {
		this.setState({ addDataError: Boolean(error), addDataValue: jsObject });
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
				addDataValue,
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
				<Item label="Document Id">
					<Input
						name="document_id"
						value={documentId}
						onChange={this.handleDocumentIdChange}
						placeholder="Enter document id"
					/>
				</Item>
				<Item label="JSON document" />
				<JsonInput
					id="add-row-modal"
					locale={locale}
					placeholder={addDataValue}
					theme="light_mitsuketa_tribute"
					height="200px"
					style={{ outerBox: { marginTop: 20 } }}
					onChange={this.handleJsonInput}
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
