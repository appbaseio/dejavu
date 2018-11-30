// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, Checkbox } from 'antd';

import StyledCell from '../DataTable/StyledCell';
import MappingsDropdown from '../MappingsDropdown';
import TermFilter from './TermFilter';
import Flex from '../Flex';

import { setSelectedRows, setUpdatingRow } from '../../actions';
import { getAppname } from '../../reducers/app';
import {
	getMappings,
	getVisibleColumns,
	getNestedVisibleColumns,
} from '../../reducers/mappings';
import {
	getTermsAggregationColumns,
	getSortableTypes,
} from '../../utils/mappings';
import { getCurrentIds } from '../../reducers/currentIds';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getMode } from '../../reducers/mode';
import popoverContent from '../CommonStyles/popoverContent';
import colors from '../theme/colors';
import idFieldStyles from '../CommonStyles/idField';
import overflowStyles from '../CommonStyles/overflowText';
import filterIconStyles from '../CommonStyles/filterIcons';
import { MODES } from '../../constants';

const sortableTypes = getSortableTypes();

type Props = {
	visibleColumns: string[],
	selectedRows: string[],
	mode: string,
	mappings: any,
	appname: string,
	handleSort: (string, any) => void,
	sortField: string,
	sort: string,
	currentIds: any[],
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	nestedVisibleColumns: string[],
	isShowingNestedColumns: boolean,
};

const getTermFilterIndex = (termFilterColumns, col) => {
	let index = termFilterColumns.indexOf(col);

	if (index === -1) {
		index =
			termFilterColumns.indexOf(`${col}.raw`) > -1
				? termFilterColumns.indexOf(`${col}.raw`)
				: termFilterColumns.indexOf(`${col}.keyword`);
	}

	return index;
};

class DataTableHeader extends Component<Props> {
	handleSelectAllRows = e => {
		const {
			target: { checked },
		} = e;
		const { onSelectedRows, onSetUpdatingRow, currentIds } = this.props;

		if (checked) {
			onSelectedRows(currentIds);
		} else {
			onSelectedRows([]);
		}
		onSetUpdatingRow(null);
	};

	getSortableColum = col => {
		const { mappings, appname, isShowingNestedColumns } = this.props;
		const mapProp = isShowingNestedColumns
			? 'nestedProperties'
			: 'properties';

		if (col === '_type' || col === '_index') {
			return col;
		}

		if (
			mappings[appname][mapProp][col] &&
			mappings[appname][mapProp][col].type &&
			sortableTypes.indexOf(mappings[appname][mapProp][col].type) > -1
		) {
			if (
				mappings[appname][mapProp][col].fields &&
				mappings[appname][mapProp][col].fields.keyword
			) {
				return `${col}.keyword`;
			}

			if (
				mappings[appname][mapProp][col].originalFields &&
				mappings[appname][mapProp][col].originalFields.keyword
			) {
				return `${col}.keyword`;
			}

			return col;
		}

		return null;
	};

	render() {
		const {
			visibleColumns,
			selectedRows,
			mode,
			mappings,
			appname,
			handleSort,
			sortField,
			sort,
			currentIds,
			isShowingNestedColumns,
			nestedVisibleColumns,
		} = this.props;
		const mappingCols = isShowingNestedColumns
			? nestedVisibleColumns
			: visibleColumns;
		const columns = ['_id', ...mappingCols];
		const mapProp = isShowingNestedColumns
			? 'nestedProperties'
			: 'properties';
		const termFilterColumns = mappings
			? getTermsAggregationColumns(mappings[appname], mapProp)
			: [];

		if (columns.length > 1) {
			return (
				<table
					css={{
						overflowX: 'auto',
						position: 'sticky',
						top: 0,
						height: 26,
						zIndex: 102,
						background: colors.tableHead,
					}}
				>
					<thead>
						<tr>
							{columns.map(col => {
								const termFilterIndex = getTermFilterIndex(
									termFilterColumns,
									col,
								);
								return (
									<th
										key={col}
										css={{
											minWidth: 200,
											maxWidth: 200,
										}}
										className={
											col === '_id' && idFieldStyles
										}
									>
										{col === '_id' ? (
											<StyledCell
												css={{
													display: 'flex',
													justifyContet: 'left',
													alignItems: 'center',
												}}
											>
												<Flex
													css={{
														width: '15%',
													}}
													alignItems="center"
													justifyContent="center"
												>
													{selectedRows.length >= 1 &&
														mode === MODES.EDIT && (
															<Checkbox
																onChange={
																	this
																		.handleSelectAllRows
																}
																checked={
																	selectedRows.length ===
																	currentIds.length
																}
															/>
														)}
												</Flex>
												<Popover
													content={
														<div
															css={popoverContent}
														>
															Clicking on{' '}
															{`{...}`} displays
															the JSON data.
														</div>
													}
													trigger="click"
												>
													<span
														css={{
															cursor: 'pointer',
															maxWidth: '10%',
															minWidth: '10%',
														}}
													>{` {...} `}</span>
												</Popover>
												<div
													css={{
														marginLeft: '10px',
													}}
												>
													_id
													<i
														css={{
															fontSize: 12,
															fontWeight:
																'normal',
														}}
													>
														{selectedRows.length >
															0 &&
															`  (${
																selectedRows.length
															} rows selected)`}
													</i>
												</div>
											</StyledCell>
										) : (
											<StyledCell>
												<Flex
													justifyContent="space-between"
													alignItems="center"
													wrap="nowrap"
													css={{
														width: '100%',
													}}
												>
													<Flex
														alignItems="center"
														wrap="nowrap"
													>
														{mappings[appname][
															mapProp
														][col] && (
															<MappingsDropdown
																mapping={
																	mappings[
																		appname
																	][mapProp][
																		col
																	]
																}
															/>
														)}
														<Popover
															content={col}
															trigger="click"
														>
															<span
																css={{
																	marginLeft:
																		'10px',
																	cursor:
																		'pointer',
																	maxWidth: 120,
																}}
																className={
																	overflowStyles
																}
															>
																{col}
															</span>
														</Popover>
													</Flex>
													{this.getSortableColum(
														col,
													) && (
														<Flex alignItems="center">
															{termFilterIndex >
																-1 && (
																<TermFilter
																	field={
																		termFilterColumns[
																			termFilterIndex
																		]
																	}
																/>
															)}
															<button
																type="button"
																onClick={() => {
																	const sortingCol = this.getSortableColum(
																		col,
																	);
																	handleSort(
																		// $FlowFixMe
																		sortingCol,
																	);
																}}
																css={{
																	outline: 0,
																	height:
																		'15px',
																	width:
																		'15px',
																	border: 0,
																	cursor:
																		'pointer',
																	background:
																		'none',
																}}
																className={
																	filterIconStyles
																}
															>
																{sortField.indexOf(
																	col,
																) === -1 && (
																	<i
																		className="fa fa-sort"
																		css={{
																			fontSize: 15,
																		}}
																	/>
																)}
																{sortField.indexOf(
																	col,
																) > -1 && (
																	<i
																		className={
																			sort ===
																			'asc'
																				? 'fa fa-caret-up'
																				: 'fa fa-caret-down'
																		}
																		css={{
																			fontSize: 15,
																			color:
																				'#333 !important',
																		}}
																	/>
																)}
															</button>
														</Flex>
													)}
												</Flex>
											</StyledCell>
										)}
									</th>
								);
							})}
						</tr>
					</thead>
				</table>
			);
		}
		return null;
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	mappings: getMappings(state),
	visibleColumns: getVisibleColumns(state),
	selectedRows: getSelectedRows(state),
	mode: getMode(state),
	currentIds: getCurrentIds(state),
	nestedVisibleColumns: getNestedVisibleColumns(state),
});

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTableHeader);
