// @flow

import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import {
	getNestedSearchableColumns,
	getSearchableColumns,
	getSearchableColumnsWeights,
	getNesetedSearchableColumnsWeights,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';
import { getMode } from '../../reducers/mode';
import { MODES } from '../../constants';

type Props = {
	isShowingNestedColumns: boolean,
	nestedSearchableColumns: string[],
	searchableColumns: string[],
	mode: string,
	searchableColumnsWeights: number[],
	nestedSearchableColumnsWeights: number[],
};

type State = {
	searchValue: string,
	hasMounted: boolean,
};

class GlobalSearch extends Component<Props, State> {
	state = {
		searchValue: '',
		hasMounted: true,
	};

	shouldComponentUpdate(nextProps) {
		const { searchValue } = this.state;
		if (nextProps.mode !== this.props.mode && searchValue.trim()) {
			this.setMountState(false);
			setTimeout(() => {
				this.setMountState(true);
			});

			return false;
		}
		return true;
	}

	setMountState = hasMounted => {
		this.setState({
			hasMounted,
		});
	};

	handleSearchValueChange = (searchValue, triggerQuery) => {
		this.setState(
			{
				searchValue,
			},
			() => triggerQuery(),
		);
	};

	render() {
		const {
			isShowingNestedColumns,
			nestedSearchableColumns,
			searchableColumns: searchCols,
			searchableColumnsWeights,
			nestedSearchableColumnsWeights,
			mode,
		} = this.props;
		const searchableColumns = isShowingNestedColumns
			? nestedSearchableColumns
			: searchCols;
		const weights = isShowingNestedColumns
			? nestedSearchableColumnsWeights
			: searchableColumnsWeights;
		const { searchValue, hasMounted } = this.state;

		return (
			<div css={{ position: 'relative' }}>
				{hasMounted && (
					<DataSearch
						componentId="GlobalSearch"
						autosuggest={false}
						dataField={searchableColumns}
						fieldWeights={weights}
						innerClass={{
							input: `ant-input ${css`
								padding-left: 35px !important;
								height: 32px !important;
								background: #fff !important;
							`}`,
						}}
						debounce={5}
						highlight={mode === MODES.VIEW}
						queryFormat="and"
						onChange={this.handleSearchValueChange}
						value={searchValue}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	searchableColumns: getSearchableColumns(state),
	searchableColumnsWeights: getSearchableColumnsWeights(state),
	nestedSearchableColumns: getNestedSearchableColumns(state),
	nestedSearchableColumnsWeights: getNesetedSearchableColumnsWeights(state),
	isShowingNestedColumns: getIsShowingNestedColumns(state),
	mode: getMode(state),
});

export default connect(mapStateToProps)(GlobalSearch);
