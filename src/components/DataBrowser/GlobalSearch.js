// @flow

import React from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';
import { Icon } from 'antd';
import { connect } from 'react-redux';

import {
	getNestedSearchableColumns,
	getSearchableColumns,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';

type Props = {
	isShowingNestedColumns: boolean,
	nestedSearchableColumns: string[],
	searchableColumns: string[],
};

const GlobalSearch = ({
	isShowingNestedColumns,
	nestedSearchableColumns,
	searchableColumns: searchCols,
}: Props) => {
	const searchableColumns = isShowingNestedColumns
		? nestedSearchableColumns
		: searchCols;
	const searchColumns = [
		...searchableColumns,
		...searchableColumns.map(field => `${field}.raw`),
		...searchableColumns.map(field => `${field}.search`),
		...searchableColumns.map(field => `${field}.autosuggest`),
	];
	const weights = [
		...Array(searchableColumns.length).fill(3),
		...Array(searchableColumns.length).fill(3),
		...Array(searchableColumns.length).fill(1),
		...Array(searchableColumns.length).fill(1),
	];

	return (
		<div css={{ position: 'relative' }}>
			<DataSearch
				componentId="GlobalSearch"
				autosuggest={false}
				dataField={searchColumns}
				fieldWeights={weights}
				innerClass={{
					input: `ant-input ${css`
						padding-left: 35px;
						height: 32px;
						background: #fff !important;
					`}`,
				}}
				showIcon={false}
				highlight
				queryFormat="and"
			/>
			<Icon
				type="search"
				css={{
					position: 'absolute',
					top: '50%',
					transform: 'translateY(-50%)',
					left: '10px',
				}}
			/>
		</div>
	);
};

const mapStateToProps = state => ({
	searchableColumns: getSearchableColumns(state),
	nestedSearchableColumns: getNestedSearchableColumns(state),
	isShowingNestedColumns: getIsShowingNestedColumns(state),
});

export default connect(mapStateToProps)(GlobalSearch);
