// @flow

import React, { Component } from 'react';
import { arrayOf, object, string, func } from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { Popover } from 'antd';

import MappingsDropdown from '../MappingsDropdown';
import Cell from '../Cell';
import StyledCell from './Cell.style';
import CellContent from './CellContent.style';
import Flex from '../Flex';
import SortIcon from '../../images/icons/sort.svg';

import { setCellValueRequest, addDataRequest } from '../../actions';
import { getVisibleColumns } from '../../reducers/mappings';
import { META_FIELDS, getSortableTypes } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';
import overflowText from './overflow.style';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;
const srotableTypes = getSortableTypes();

type Props = {
	data: object[],
	mappings: object,
	setCellValue: (string, string, any, string, string) => void,
	handleSortChange: string => void,
	visibleColumns: string[],
	mode: string,
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
		const { mappings, visibleColumns, mode } = this.props;

		const { data } = this.state;

		return (
			<div css={{ position: 'relative' }}>
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
													<button
														type="button"
														onClick={() => {
															this.handleSort(
																col,
															);
														}}
														css={{
															outline: 0,
															height: '15px',
															width: '15px',
															border: 0,
															cursor: 'pointer',
															background: 'none',
														}}
													>
														<img
															src={SortIcon}
															alt="sort-icon"
															css={{
																height: '15px',
																marginTop:
																	'-10px',
																marginLeft:
																	'-5px',
															}}
														/>
													</button>
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
													{col === '_id' ? (
														<Flex
															wrap="nowrap"
															css={{
																overflow:
																	'hidden',
															}}
														>
															<span
																css={{
																	margin:
																		'0 20px',
																	color:
																		colors.primary,
																}}
															>
																{row + 1}
															</span>
															<div
																css={
																	overflowText
																}
															>
																{dataItem[col]}
															</div>
														</Flex>
													) : (
														<div
															css={{
																overflowText,
															}}
														>
															{dataItem[col]}
														</div>
													)}
												</Popover>
											) : (
												<Cell
													row={row}
													column={col}
													mode={mode}
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
	setCellValue: func.isRequired,
	visibleColumns: arrayOf(string).isRequired,
	handleSortChange: func.isRequired,
	mode: string,
};

const mapStateToProps = state => ({
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
});

const mapDispatchToProps = {
	setCellValue: setCellValueRequest,
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
