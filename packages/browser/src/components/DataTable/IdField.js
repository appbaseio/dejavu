// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, Checkbox } from 'antd';

import { setSelectedRows, setUpdatingRow } from '../../actions';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getMode } from '../../reducers/mode';
import { getPageSize } from '../../reducers/pageSize';
import { MODES } from '../../constants';
import { getOnlySource, getUrlParams, convertToMax } from '../../utils';

import Flex from '../Flex';
import JsonView from '../JsonView';
import overflowText from './overflow.style';
import popoverContent from '../CommonStyles/popoverContent';

type Props = {
	value: any,
	mode: string,
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
		const {
			value,
			mode,
			selectedRows,
			data,
			rowIndex,
			pageSize,
		} = this.props;
		const { results } = getUrlParams(window.location.search);
		const currentPage = parseInt(results || 1, 10);

		return (
			<Flex wrap="nowrap" css={{ width: '100%' }} alignItems="center">
				<div>
					{convertToMax(
						pageSize * (currentPage - 1) + (rowIndex + 1),
						pageSize * (currentPage - 1) + pageSize,
					)}
				</div>
				{mode === MODES.EDIT && (
					<Checkbox
						onChange={this.handleRowSelectChange}
						value={value}
						checked={selectedRows.indexOf(value) > -1}
						css={{
							marginLeft: 8,
						}}
					/>
				)}
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
							margin: '0 7px',
						}}
					>{` {...} `}</span>
				</Popover>
				<Popover
					content={<div css={popoverContent}>{value}</div>}
					placement="topLeft"
					trigger="click"
				>
					<div
						css={{
							cursor: 'pointer',
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

export default connect(mapStateToProps, mapDispatchToProps)(IdField);
