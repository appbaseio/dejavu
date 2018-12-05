// @flow

import React from 'react';
import { connect } from 'react-redux';

import IdHeaderField from './IdHeaderField';
import DataColumneHeader from './DataColumnHeader';

import { setSelectedRows, setUpdatingRow } from '../../actions';
import {
	getVisibleColumns,
	getNestedVisibleColumns,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';
import colors from '../theme/colors';
import idFieldStyles from '../CommonStyles/idField';

type Props = {
	visibleColumns: string[],
	nestedVisibleColumns: string[],
	isShowingNestedColumns: boolean,
};

const DataTableHeader = ({
	visibleColumns,
	isShowingNestedColumns,
	nestedVisibleColumns,
}: Props) => {
	const mappingCols = isShowingNestedColumns
		? nestedVisibleColumns
		: visibleColumns;
	const columns = ['_id', ...mappingCols];

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
						{columns.map(col => (
							<th
								key={col}
								css={{
									minWidth: 200,
									maxWidth: 200,
								}}
								className={col === '_id' && idFieldStyles}
							>
								{col === '_id' ? (
									<IdHeaderField />
								) : (
									<DataColumneHeader col={col} />
								)}
							</th>
						))}
					</tr>
				</thead>
			</table>
		);
	}
	return null;
};

const mapStateToProps = state => ({
	visibleColumns: getVisibleColumns(state),
	nestedVisibleColumns: getNestedVisibleColumns(state),
	isShowingNestedColumns: getIsShowingNestedColumns(state),
});

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTableHeader);
