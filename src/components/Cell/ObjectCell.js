// @flow

import React, { Component, Fragment } from 'react';
import { func, any, string } from 'prop-types';
import { Popover, Icon, Modal } from 'antd';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

import CellStyled from './Cell.styles';
import JsonView from '../JsonView';
import { isVaildJSON } from '../../utils';

type Props = {
	children: any,
	onChange: any => void,
	mode: string,
};

type State = {
	showModal: boolean,
	error: boolean,
	value: string,
};
class ObjectCell extends Component<Props, State> {
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

	handleJsonInput = (value: string) => {
		this.setState({
			error: !isVaildJSON(value),
			value,
		});
	};

	saveValue = () => {
		const { error, value } = this.state;
		const { onChange } = this.props;
		const valueToSave = isVaildJSON(value) ? JSON.parse(value) : {};

		if (!error) {
			onChange(valueToSave);
			this.toggleModal();
		}
	};

	render() {
		const { children, mode } = this.props;
		const { showModal, error, value } = this.state;
		return (
			<Fragment>
				<CellStyled
					css={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Popover
						content={
							<div
								css={{
									maxWidth: '400px',
									maxHeight: '300px',
									overflow: 'auto',
								}}
							>
								<JsonView json={children || {}} />
							</div>
						}
						trigger="click"
					>
						<span css={{ cursor: 'pointer' }}>{` {...} `}</span>
					</Popover>
					{mode === 'edit' && (
						<Icon
							type="edit"
							onClick={this.toggleModal}
							css={{ cursor: 'pointer' }}
						/>
					)}
				</CellStyled>
				<Modal
					visible={showModal}
					onCancel={this.toggleModal}
					onOk={this.saveValue}
					okButtonProps={{ disabled: error }}
					destroyOnHide
				>
					<br />
					<AceEditor
						tabSize={2}
						mode="json"
						theme="github"
						onChange={this.handleJsonInput}
						name="object-editor"
						value={value}
						height="auto"
						width="100%"
						css={{
							minHeight: '300px',
							maxHeight: '400px',
						}}
					/>
				</Modal>
			</Fragment>
		);
	}
}

ObjectCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default ObjectCell;
