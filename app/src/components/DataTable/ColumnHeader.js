// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover } from 'antd';

import StyledCell from './StyledCell';
import MappingsDropdown from '../MappingsDropdown';
import TermFilter from './TermFilter';
import Flex from '../Flex';

import { getAppname } from '../../reducers/app';
import {
	getMappings,
	getTermsAggregationColumns,
	getSortableColumns,
} from '../../reducers/mappings';
import { getSort } from '../../reducers/sort';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';
import { setSort } from '../../actions';
import overflowStyles from '../CommonStyles/overflowText';
import filterIconStyles from '../CommonStyles/filterIcons';
import colors from '../theme/colors';

type Props = {
	mappings: any,
	appname: string,
	onSetSort: (string, string) => void,
	sortField: string,
	sortOrder: string,
	isShowingNestedColumns: boolean,
	termsAggregationColumns: string[],
	sortableColumns: string[],
	col: string,
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

const getSortableColumnIndex = (sortableColumns, col) => {
	let index = sortableColumns.indexOf(`${col}.keyword`);
	if (index === -1) {
		index =
			sortableColumns.indexOf(`${col}.raw`) > -1
				? sortableColumns.indexOf(`${col}.raw`)
				: sortableColumns.indexOf(col);
	}

	return index;
};

class DataColumnHeader extends Component<Props> {
	handleSortChange = field => {
		const { sortField, sortOrder, onSetSort } = this.props;

		let newSortOrder = sortOrder;
		if (field === sortField) {
			newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		}

		onSetSort(newSortOrder, field);
	};

	render() {
		const {
			mappings,
			appname,
			sortField,
			sortOrder,
			isShowingNestedColumns,
			termsAggregationColumns,
			sortableColumns,
			col,
		} = this.props;
		const mapProp = isShowingNestedColumns
			? 'nestedProperties'
			: 'properties';
		const termFilterIndex = getTermFilterIndex(
			termsAggregationColumns,
			col,
		);

		const sortableColumnIndex = getSortableColumnIndex(
			sortableColumns,
			col,
		);
		if (mappings) {
			return (
				<StyledCell
					css={{ background: colors.tableHead, fontWeight: 'bold' }}
				>
					<Flex
						justifyContent="space-between"
						alignItems="center"
						wrap="nowrap"
						css={{
							width: '100%',
						}}
					>
						<Flex alignItems="center" wrap="nowrap">
							{mappings[appname] &&
								mappings[appname][mapProp] &&
								mappings[appname][mapProp][col] && (
									<MappingsDropdown
										mapping={
											mappings[appname][mapProp][col]
										}
									/>
								)}
							<Popover content={col} trigger="click">
								<span
									css={{
										marginLeft: '10px',
										cursor: 'pointer',
										maxWidth: 120,
									}}
									className={overflowStyles}
								>
									{col}
								</span>
							</Popover>
						</Flex>
						{sortableColumnIndex > -1 && (
							<Flex alignItems="center">
								{termFilterIndex > -1 && (
									<TermFilter
										field={
											termsAggregationColumns[
												termFilterIndex
											]
										}
									/>
								)}
								<button
									type="button"
									onClick={() => {
										this.handleSortChange(
											sortableColumns[
												sortableColumnIndex
											],
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
									className={filterIconStyles}
								>
									{sortField.indexOf(col) === -1 && (
										<i
											className="fa fa-sort"
											css={{
												fontSize: 15,
											}}
										/>
									)}
									{sortField.indexOf(col) > -1 && (
										<i
											className={
												sortOrder === 'asc'
													? 'fa fa-caret-up'
													: 'fa fa-caret-down'
											}
											css={{
												fontSize: 15,
												color: '#333 !important',
											}}
										/>
									)}
								</button>
							</Flex>
						)}
					</Flex>
				</StyledCell>
			);
		}
		return null;
	}
}

const mapStateToProps = state => {
	const { order: sortOrder, field: sortField } = getSort(state);
	return {
		appname: getAppname(state),
		mappings: getMappings(state),
		sortField,
		sortOrder,
		termsAggregationColumns: getTermsAggregationColumns(state),
		sortableColumns: getSortableColumns(state),
		isShowingNestedColumns: getIsShowingNestedColumns(state),
	};
};

const mapDispatchToProps = {
	onSetSort: setSort,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataColumnHeader);
