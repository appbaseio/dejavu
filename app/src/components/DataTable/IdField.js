// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, Button, Icon, Tooltip } from 'antd';

import { setSelectedRows, setUpdatingRow } from '../../actions';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getMode } from '../../reducers/mode';
import { getPageSize } from '../../reducers/pageSize';
import { getOnlySource, getUrlParams } from '../../utils';

import Flex from '../Flex';
import JsonView from '../JsonView';
import overflowText from './overflow.style';
import popoverContent from '../CommonStyles/popoverContent';
import PromoteButton from './PromoteButton';
import HideButton from './HideButton';

type Props = {
	value: any,
	selectedRows: any[],
	setSelectedRows: (string[]) => void,
	setUpdatingRow: any => void,
	data: any,
	rowIndex: number,
	pageSize: number,
};
class IdField extends Component<Props> {
	handleRowSelectChange = e => {
		const {
			target: { checked, value },
		} = e;
		const currentSelectedRows = [...this.props.selectedRows];
		const currentValueIndex = currentSelectedRows.indexOf(value);
		let newSelectedRows = [];
		if (checked && currentValueIndex === -1) {
			newSelectedRows = [...currentSelectedRows, value];
		} else {
			newSelectedRows = [
				...currentSelectedRows.slice(0, currentValueIndex),
				...currentSelectedRows.slice(currentValueIndex + 1),
			];
		}

		if (newSelectedRows.length === 1) {
			const data = this.props.data.find(
				item => item._id === newSelectedRows[0],
			);
			this.props.setUpdatingRow(data);
		} else {
			this.props.setUpdatingRow(null);
		}

		this.props.setSelectedRows(newSelectedRows);
	};

	render() {
		const { value, selectedRows, data, rowIndex, pageSize } = this.props;
		const { results } = getUrlParams(window.location.search);
		const currentPage = parseInt(results || 1, 10);

		const fieldData = data.find(item => item._id === value);

		return (
			<Flex wrap="nowrap" css={{ width: '100%' }} alignItems="center">
				<div
					css={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{selectedRows.indexOf(value) === -1 && (
						<div className="index-no" css={{ minWidth: 16 }}>
							{pageSize * (currentPage - 1) + (rowIndex + 1)}
						</div>
					)}
					&nbsp;&nbsp;&nbsp;
					<PromoteButton
						item={fieldData}
						renderButton={({
							promoteResult,
							isLoading,
							disabled,
						}) => (
							<Tooltip
								placement="top"
								title={
									disabled
										? 'Already Promoted or Hidden'
										: 'Promote this result'
								}
							>
								<Button
									disabled={disabled}
									shape="circle"
									onClick={promoteResult}
									style={{ borderColor: '#174aff' }}
								>
									<Icon
										type={isLoading ? 'loading' : 'star'}
										style={{ color: '#174aff' }}
									/>
								</Button>
							</Tooltip>
						)}
					/>
					&nbsp;
					<HideButton
						id={fieldData._id}
						renderButton={({ hideItem, isLoading, disabled }) => (
							<Tooltip
								placement="top"
								title={
									disabled
										? 'Already Promoted or Hidden'
										: 'Promote this result'
								}
							>
								<Button
									shape="circle"
									type="dashed"
									disabled={disabled}
									onClick={hideItem}
								>
									<Icon
										type={
											isLoading
												? 'loading'
												: 'eye-invisible'
										}
									/>
								</Button>
							</Tooltip>
						)}
					/>
					&nbsp;
				</div>
				<Popover
					content={
						<div css={popoverContent}>
							<JsonView json={getOnlySource(data[rowIndex])} />
						</div>
					}
					trigger="click"
				>
					<span
						css={{
							cursor: 'pointer',
							maxWidth: '10%',
							minWidth: '10%',
							marginLeft: 12,
						}}
					>{`{...}`}</span>
				</Popover>
				<Popover
					content={<div css={popoverContent}>{value}</div>}
					placement="topLeft"
					trigger="click"
				>
					<div
						css={{
							cursor: 'pointer',
							maxWidth: '75%',
							minWidth: '75%',
							...overflowText,
						}}
					>
						{value}
					</div>
				</Popover>
			</Flex>
		);
	}
}

const mapStateToProps = state => ({
	mode: getMode(state),
	selectedRows: getSelectedRows(state),
	pageSize: getPageSize(state),
});

const mapDispatchToProps = {
	setSelectedRows,
	setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(IdField);
