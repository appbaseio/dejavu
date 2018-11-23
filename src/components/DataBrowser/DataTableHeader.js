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
import { getMappings, getVisibleColumns } from '../../reducers/mappings';
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
import filterIconStyles from '../CommonStyles/filterIcons';
import { MODES } from '../../constants';

const srotableTypes = getSortableTypes();

type Props = {
	visibleColumns: string[],
	selectedRows: string[],
	mode: string,
	mappings: any,
	appname: string,
	handleSort: string => void,
	sortField: string,
	sort: string,
	currentIds: any[],
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
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
		} = this.props;
		const columns = ['_id', ...visibleColumns];
		const termFilterColumns = mappings
			? getTermsAggregationColumns(mappings[appname])
			: [];

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
							const termFilterIndex =
								termFilterColumns.indexOf(col) > -1
									? termFilterColumns.indexOf(col)
									: termFilterColumns.indexOf(`${col}.raw`);
							return (
								<th
									key={col}
									css={{
										minWidth: 200,
										maxWidth: 200,
									}}
									className={col === '_id' && idFieldStyles}
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
													<div css={popoverContent}>
														Clicking on {`{...}`}{' '}
														displays the JSON data.
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
														fontWeight: 'normal',
													}}
												>
													{selectedRows.length > 0 &&
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
												css={{
													width: '100%',
												}}
											>
												<Flex alignItems="center">
													{mappings[appname]
														.properties[col] && (
														<MappingsDropdown
															mapping={
																mappings[
																	appname
																].properties[
																	col
																]
															}
														/>
													)}
													<span
														css={{
															marginLeft: '10px',
														}}
													>
														{col}
													</span>
												</Flex>
												{mappings[appname].properties[
													col
												] &&
													mappings[appname]
														.properties[col].type &&
													srotableTypes.indexOf(
														mappings[appname]
															.properties[col]
															.type,
													) > -1 && (
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
																	handleSort(
																		col,
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
																				? 'fa fa-caret-down'
																				: 'fa fa-caret-up'
																		}
																		css={{
																			fontSize: 15,
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
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	mappings: getMappings(state),
	visibleColumns: getVisibleColumns(state),
	selectedRows: getSelectedRows(state),
	mode: getMode(state),
	currentIds: getCurrentIds(state),
});

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTableHeader);
