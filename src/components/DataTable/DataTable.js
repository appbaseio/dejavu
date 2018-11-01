// @flow

import React, { Component, Fragment } from 'react';
import { arrayOf, object, string, func } from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { Popover, Button, Popconfirm } from 'antd';

import MappingsDropdown from '../MappingsDropdown';
import Cell from '../Cell';
import StyledCell from './Cell.style';
import CellContent from './CellContent.style';
import Flex from '../Flex';
import SortIcon from '../../images/icons/sort.svg';
import UpdateRow from './UpdateRow';

import {
	setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
} from '../../actions';
import { getUrl } from '../../reducers/app';
import { getVisibleColumns } from '../../reducers/mappings';
import { META_FIELDS, getSortableTypes } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';
import overflowText from './overflow.style';
import { addData, deleteData } from '../../apis';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;
const srotableTypes = getSortableTypes();

const getUpdateProps = dataItem => {
	const { _index, _type, _id, ...data } = dataItem;
	return {
		index: _index,
		type: _type,
		documentId: _id,
		data,
	};
};

type Props = {
	data: object[],
	mappings: object,
	setCellValue: (string, string, any, string, string) => void,
	handleSortChange: string => void,
	visibleColumns: string[],
	mode: string,
	appUrl: string,
	setError: any => void,
	clearError: () => void,
	updateReactiveList: () => void,
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

	handleDelete = async item => {
		const {
			appUrl,
			setError: onSetError,
			clearError: onClearError,
			updateReactiveList: onUpdateReactiveList,
		} = this.props;

		try {
			onClearError();
			await deleteData(item._index, item._type, item._id, appUrl);
			onUpdateReactiveList();
		} catch (error) {
			onSetError(error);
		}
	};

	handleUpdateData = async (index, type, id, updatedData) => {
		const {
			appUrl,
			setError: onSetError,
			clearError: onClearError,
			updateReactiveList: onUpdateReactiveList,
		} = this.props;

		try {
			onClearError();
			await addData(index, type, id, appUrl, updatedData);
			onUpdateReactiveList();
		} catch (error) {
			onSetError(error);
		}
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
												<Fragment>
													{col === '_id' ? (
														<Flex
															wrap="nowrap"
															alignItems="center"
															css={{
																overflow:
																	'hidden',
															}}
														>
															<span
																css={{
																	margin:
																		'0 10px',
																	color:
																		colors.primary,
																}}
															>
																{row + 1}
															</span>
															{mode ===
																'edit' && (
																<Fragment>
																	<UpdateRow
																		{...getUpdateProps(
																			dataItem,
																		)}
																		handleUpdateData={
																			this
																				.handleUpdateData
																		}
																	/>
																	<Popconfirm
																		title="Are you sure delete this record?"
																		placement="right"
																		onConfirm={() =>
																			this.handleDelete(
																				dataItem,
																			)
																		}
																		okText="Yes"
																		cancelText="No"
																	>
																		<Button
																			type="danger"
																			icon="delete"
																			css={{
																				margin:
																					'0 3px',
																			}}
																		/>
																	</Popconfirm>
																</Fragment>
															)}
															<div
																css={
																	overflowText
																}
															>
																<Popover
																	placement="topLeft"
																	content={
																		dataItem[
																			col
																		]
																	}
																>
																	{
																		dataItem[
																			col
																		]
																	}
																</Popover>
															</div>
														</Flex>
													) : (
														<div css={overflowText}>
															<Popover
																placement="topLeft"
																content={
																	dataItem[
																		col
																	]
																}
															>
																{dataItem[col]}
															</Popover>
														</div>
													)}
												</Fragment>
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
	appUrl: string,
	setError: func,
	clearError: func,
	updateReactiveList: func,
};

const mapStateToProps = state => ({
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
	appUrl: getUrl(state),
});

const mapDispatchToProps = {
	setCellValue: setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
