// @flow

// $FlowFixMe
import React, { forwardRef } from 'react';
import { connect } from 'react-redux';

import IdHeaderField from './IdHeaderField';
import ColumnHeader from './ColumnHeader';
import Flex from '../Flex';

import { setSelectedRows, setUpdatingRow } from '../../actions';
import {
	getVisibleColumns,
	getNestedVisibleColumns,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';

type Props = {
	visibleColumns: string[],
	nestedVisibleColumns: string[],
	isShowingNestedColumns: boolean,
	headerRef: any,
};

const DataTableHeader = ({
	visibleColumns,
	isShowingNestedColumns,
	nestedVisibleColumns,
	headerRef,
}: Props) => {
	const mappingCols = isShowingNestedColumns
		? nestedVisibleColumns
		: visibleColumns;
	const columns = ['_id', ...mappingCols];

	if (columns.length >= 1) {
		return (
			<Flex
				wrap="nowrap"
				css={{
					zIndex: 100,
					position: 'relative',
					overflow: 'hidden',
				}}
				innerRef={headerRef}
			>
				{columns.map(col =>
					col === '_id' ? (
						<IdHeaderField key={col} />
					) : (
						<ColumnHeader col={col} key={col} />
					),
				)}
			</Flex>
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

const DataTableContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTableHeader);

export default forwardRef((props, ref) => (
	<DataTableContainer {...props} headerRef={ref} />
));
