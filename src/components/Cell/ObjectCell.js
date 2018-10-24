import React, { Component } from 'react';
import { func, number, string, any, bool } from 'prop-types';
import { Popover, Button, Modal } from 'antd';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import CellStyled from './Cell.styles';
import JsonView from '../JsonView';
import { isVaildJSON } from '../../utils';

class ObjectCell extends Component {
	state = {
		showModal: false,
		error: false,
		value: JSON.stringify(this.props.children, null, 2),
	};

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	};

	handleJsonInput = value => {
		this.setState({
			error: !isVaildJSON(value),
			value,
		});
	};

	saveValue = () => {
		const { error, value } = this.state;
		const { onChange, row, column } = this.props;
		const valueToSave = JSON.parse(value || {});
		if (!error) {
			onChange(row, column, valueToSave);
			this.toggleModal();
		}
	};

	render() {
		const { children, row, column, active } = this.props;
		const { showModal, error, value } = this.state;
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
							content={
								<div
									style={{
										maxWidth: '400px',
										maxHeight: '300px',
										overflow: 'auto',
									}}
								>
									<JsonView json={children} />
								</div>
							}
							trigger="click"
						>
							<Button shape="circle" icon="ellipsis" />
						</Popover>
					)}
					{active && (
						<Button
							shape="circle"
							icon="edit"
							css={{ border: 'none' }}
							onClick={this.toggleModal}
						/>
					)}
				</CellStyled>
				<Modal
					visible={showModal}
					onCancel={this.toggleModal}
					onOk={this.saveValue}
					okButtonProps={{ disabled: error }}
				>
					<br />
					<AceEditor
						tabSize={2}
						mode="json"
						theme="github"
						onChange={this.handleJsonInput}
						name={`${row}-${column}-json`}
						value={value}
						height="auto"
						width="100%"
						style={{
							minHeight: '300px',
							maxHeight: '400px',
						}}
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
	active: bool,
};

export default ObjectCell;
