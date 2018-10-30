// @flow

import React, { Component } from 'react';
import { arrayOf, object, shape, string, number, func } from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { Popover, Icon } from 'antd';

import MappingsDropdown from '../MappingsDropdown';
import Cell from '../Cell';
import StyledCell from './Cell.style';
import CellContent from './CellContent.style';
import Flex from '../Flex';

import { getActiveCell } from '../../reducers/cell';
import {
	setCellActive,
	setCellValueRequest,
	addDataRequest,
} from '../../actions';
import { getVisibleColumns } from '../../reducers/mappings';
import { META_FIELDS, getSortableTypes } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;
const srotableTypes = getSortableTypes();

type Props = {
	data: object[],
	mappings: object,
	activeCell: { row: number, column: string },
	setCellActive: func,
	setCellValue: (string, string, any, string, string) => void,
	handleSortChange: string => void,
	visibleColumns: string[],
	mode: string,
	sort: string,
};

type State = {
	data: object[],
};
class DataTable extends Component<Props, State> {
	state = {
		data: this.props.data,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.data.length !== this.props.data.length) {
			this.updateData(this.props.data);
		}
	}

	updateData = data => {
		this.setState({
			data,
		});
	};

	handleChange = (row, column, value) => {
		const { setCellValue } = this.props;
		const { data } = this.state;

		const nextData = [
			...data.slice(0, row),
			{
				...data[row],
				[column]: value,
			},
			...data.slice(row + 1),
		];
		this.setState({
			data: nextData,
		});
		const record = data[row];
		setCellValue(record._id, column, value, record._index, record._type);
	};

	handleSort = col => {
		const { mappings, handleSortChange } = this.props;
		let column = col;

		if (
			mappings.properties[col] &&
			mappings.properties[col].type &&
			(mappings.properties[col].type === 'text' ||
				mappings.properties[col].type === 'string')
		) {
			column =
				mappings.properties[col].type === 'text'
					? `${col}.keyword`
					: `${col}.raw`;
		}

		handleSortChange(column);
	};

	render() {
		const {
			activeCell,
			mappings,
			setCellActive: setCellActiveDispatch,
			visibleColumns,
			mode,
			sort,
		} = this.props;

		const { data } = this.state;

		return (
			<div>
				<table
					css={{
						overflow: 'auto',
						borderRadius: '4px',
					}}
				>
					<thead>
						<tr>
							{visibleColumns.map(col => (
								<StyledCell
									key={col}
									isHeader
									className={
										col === '_id' &&
										css({
											zIndex: '101 !important',
										})
									}
									isFixed={col === '_id'}
								>
									<CellContent
										css={{
											padding: '10px',
										}}
									>
										<Flex
											justifyContent="space-between"
											alignItems="center"
											css={{
												width: '100%',
											}}
										>
											<Flex alignItems="center">
												{mappings.properties[col] && (
													<MappingsDropdown
														mapping={
															mappings.properties[
																col
															]
														}
													/>
												)}
												<span
													css={{ marginLeft: '5px' }}
												>
													{col}
												</span>
											</Flex>
											{mappings.properties[col] &&
												mappings.properties[col].type &&
												srotableTypes.indexOf(
													mappings.properties[col]
														.type,
												) > -1 && (
													<Icon
														type={`sort-${
															sort === 'asc'
																? 'ascending'
																: 'descending'
														}`}
														onClick={() =>
															this.handleSort(col)
														}
														css={{
															cursor: 'pointer',
														}}
													/>
												)}
										</Flex>
									</CellContent>
								</StyledCell>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((dataItem, row) => (
							<tr key={dataItem._id}>
								{visibleColumns.map(col => (
									<StyledCell
										key={`${dataItem._id}-${col}`}
										className={
											col === '_id' &&
											css({
												zIndex: 3,
												background: colors.white,
											})
										}
										isFixed={col === '_id'}
									>
										<CellContent>
											{isMetaField(col) ? (
												<Popover
													placement="topLeft"
													content={dataItem[col]}
												>
													<div
														style={{
															width: '100%',
															overflow: 'hidden',
															textOverflow:
																'ellipsis',
															whiteSpace:
																'nowrap',
														}}
													>
														{dataItem[col]}
													</div>
												</Popover>
											) : (
												<Cell
													row={row}
													column={col}
													mode={mode}
													active={
														mode === 'edit' &&
														activeCell.row ===
															row &&
														activeCell.column ===
															col
													}
													onChange={value =>
														this.handleChange(
															row,
															col,
															value,
														)
													}
													mapping={
														mappings.properties[col]
													}
													handleFocus={e => {
														e.stopPropagation();
														if (mode === 'edit') {
															setCellActiveDispatch(
																row,
																col,
															);
														}
													}}
													handleBlur={e => {
														e.stopPropagation();
														if (mode === 'edit') {
															setCellActiveDispatch(
																null,
																null,
															);
														}
													}}
													shouldAutoFocus
												>
													{dataItem[col]}
												</Cell>
											)}
										</CellContent>
									</StyledCell>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
	activeCell: shape({ row: number, column: string }),
	setCellActive: func.isRequired,
	setCellValue: func.isRequired,
	visibleColumns: arrayOf(string).isRequired,
	handleSortChange: func.isRequired,
	sort: string,
	mode: string,
};

const mapStateToProps = state => ({
	activeCell: getActiveCell(state),
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
});

const mapDispatchToProps = {
	setCellActive,
	setCellValue: setCellValueRequest,
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
