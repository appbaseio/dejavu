// @flow

import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';
import { Icon } from 'antd';
import { connect } from 'react-redux';

import {
	getNestedSearchableColumns,
	getSearchableColumns,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';
import { getMode } from '../../reducers/mode';
import { updateReactiveList } from '../../actions';
import { MODES } from '../../constants';

type Props = {
	isShowingNestedColumns: boolean,
	nestedSearchableColumns: string[],
	searchableColumns: string[],
	mode: string,
	updateReactiveList: () => void,
};

class GlobalSearch extends Component<Props> {
	componentDidUpdate(nextProps) {
		if (this.props.mode !== nextProps.mode) {
			this.props.updateReactiveList();
		}
	}

	render() {
		const {
			isShowingNestedColumns,
			nestedSearchableColumns,
			searchableColumns: searchCols,
			mode,
		} = this.props;
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
					highlight={mode === MODES.VIEW}
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
	}
}

const mapStateToProps = state => ({
	searchableColumns: getSearchableColumns(state),
	nestedSearchableColumns: getNestedSearchableColumns(state),
	isShowingNestedColumns: getIsShowingNestedColumns(state),
	mode: getMode(state),
});

const mapDispatchToProps = {
	updateReactiveList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(GlobalSearch);
