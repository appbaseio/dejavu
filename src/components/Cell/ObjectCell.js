import React, { Component } from 'react';
import { func, number, string, any } from 'prop-types';
import { Popover, Button, Modal } from 'antd';
import JsonInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import CellStyled from './Cell.styles';
import JsonView from '../JsonView';

class ObjectCell extends Component {
	state = {
		showModal: false,
		error: false,
		value: this.props.children,
	};

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	};

	handleJsonInput = ({ error, jsObject }) => {
		this.setState({ error: Boolean(error), value: jsObject });
	};

	saveValue = () => {
		const { error, value } = this.state;
		const { onChange, row, column } = this.props;
		const valueToSave = value || {};
		if (!error) {
			onChange(row, column, valueToSave);
			this.toggleModal();
		}
	};

	render() {
		const { children, row, column } = this.props;
		const { showModal, error } = this.state;
		return (
			<>
				<CellStyled
					padding={10}
					css={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexDirection: children ? 'row' : 'row-reverse',
					}}
				>
					{children && (
						<Popover
							content={<JsonView json={children} />}
							trigger="click"
						>
							<Button shape="circle" icon="ellipsis" />
						</Popover>
					)}
					<Button
						shape="circle"
						icon="edit"
						css={{ border: 'none' }}
						onClick={this.toggleModal}
					/>
				</CellStyled>
				<Modal
					visible={showModal}
					onCancel={this.toggleModal}
					onOk={this.saveValue}
					okButtonProps={{ disabled: error }}
				>
					<JsonInput
						id={`${row}-${column}-json`}
						locale={locale}
						placeholder={children}
						theme="light_mitsuketa_tribute"
						style={{ outerBox: { marginTop: 20 } }}
						onChange={this.handleJsonInput}
					/>
				</Modal>
			</>
		);
	}
}

ObjectCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
};

export default ObjectCell;
