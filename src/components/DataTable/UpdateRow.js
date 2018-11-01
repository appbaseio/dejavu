// @flow

import React, { Component, Fragment } from 'react';
import { Modal, Input, Row, Col, Button, Form } from 'antd';
import { func, string, object } from 'prop-types';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import { isVaildJSON } from '../../utils';

const { Item } = Form;

type Props = {
	index: string,
	type: string,
	documentId: string,
	data: object,
	handleUpdateData: func,
};

type State = {
	isShowingModal: boolean,
	dataError: boolean,
	jsonValue: string,
};

class UpdateRowModal extends Component<Props, State> {
	state = {
		isShowingModal: false,
		dataError: false,
		jsonValue: JSON.stringify(this.props.data || {}, null, 2),
	};

	handleAfterClose = () => {
		this.setState({
			dataError: false,
			jsonValue: `{\n}`,
		});
	};

	handleJsonInput = (val: any) => {
		this.setState({
			dataError: !isVaildJSON(val),
			jsonValue: val,
		});
	};

	toggleModal = () => {
		this.setState(prevState => ({
			isShowingModal: !prevState.isShowingModal,
		}));
	};

	handleSubmit = () => {
		const { dataError, jsonValue } = this.state;
		const { index, type, documentId, handleUpdateData } = this.props;

		if (!dataError) {
			handleUpdateData(index, type, documentId, JSON.parse(jsonValue));
			this.toggleModal();
		}
	};

	render() {
		const { index, type, documentId } = this.props;
		const { isShowingModal, dataError, jsonValue } = this.state;

		return (
			<Fragment>
				<Button
					icon="edit"
					type="primary"
					css={{
						margin: '0 3px',
					}}
					onClick={this.toggleModal}
				/>

				<Modal
					visible={isShowingModal}
					onCancel={this.toggleModal}
					afterClose={this.handleAfterClose}
					onOk={this.handleSubmit}
					okButtonProps={{ disabled: dataError }}
					css={{
						top: '10px',
					}}
					destroyOnClose
					maskClosable={false}
				>
					<Row>
						<Col span={12}>
							<Item label="Index" css={{ marginRight: '10px' }}>
								<Input name="index" value={index} disabled />
							</Item>
						</Col>
						<Col span={12}>
							<Item label="Type">
								<Input name="type" value={type} disabled />
							</Item>
						</Col>
					</Row>
					<Item label="Document Id">
						<Input
							name="document_id"
							value={documentId}
							disabled
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
						value={jsonValue}
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

UpdateRowModal.propTypes = {
	index: string.isRequired,
	type: string.isRequired,
	documentId: string.isRequired,
	data: object,
	handleUpdateData: func.isRequired,
};

export default UpdateRowModal;
