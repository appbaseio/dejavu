import React, { Component } from 'react';
import { Modal, Input, Form } from 'antd';
import { string, func, bool, object } from 'prop-types';
import JsonInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { connect } from 'react-redux';

import { getAppname } from '../../reducers/app';
import { getMappings, getIndexes, getTypes } from '../../reducers/mappings';
import { addMappingRequest } from '../../actions';

const { Item } = Form;

class AddFieldModal extends Component {
	state = {
		addColumnError: false,
		addColumnField: '',
		isColumnFieldValid: true,
		addColumnMapping: null,
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
		const { addColumnError, addColumnField, addColumnMapping } = this.state;
		if (!addColumnError && addColumnField && addColumnMapping) {
			this.props.toggleModal();
			this.props.addMappingRequest(addColumnField, addColumnMapping);
		}
	};

	render() {
		const { showModal, toggleModal } = this.props;
		const {
			addColumnError,
			addColumnField,
			isColumnFieldValid,
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
						!isColumnFieldValid,
				}}
			>
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
				<div> Mapping: </div>
				<JsonInput
					id="add-row-modal"
					locale={locale}
					placeholder={{}}
					theme="light_mitsuketa_tribute"
					style={{
						outerBox: {
							marginTop: 20,
							height: 'auto',
							minHeight: '300px',
							maxHeight: '420px',
						},
						container: {
							height: 'auto',
							minHeight: '300px',
							maxHeight: '420px',
						},
					}}
					onChange={this.handleJsonInput}
				/>
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
};

const mapStateToProps = state => ({
	appname: getAppname(state),
	mappings: getMappings(state),
	indexes: getIndexes(state),
	types: getTypes(state),
});

const mapDispatchToProps = {
	addMappingRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddFieldModal);
