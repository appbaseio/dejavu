// @flow

import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';

import {
	getNestedSearchableColumns,
	getSearchableColumns,
	getSearchableColumnsWeights,
	getNesetedSearchableColumnsWeights,
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
	searchableColumnsWeights: number[],
	nestedSearchableColumnsWeights: number[],
	searchTerm: string,
};

type State = {
	searchValue: string,
};

class GlobalSearch extends Component<Props, State> {
	state = {
		searchValue: '',
	};

	componentDidUpdate(nextProps) {
		const { searchValue } = this.state;

		if (this.props.mode !== nextProps.mode && searchValue.trim()) {
			this.props.updateReactiveList();
		}
	}

	handleSearchValueChange = searchValue => {
		this.setState({
			searchValue,
		});
	};

	render() {
		const {
			isShowingNestedColumns,
			nestedSearchableColumns,
			searchableColumns: searchCols,
			searchableColumnsWeights,
			nestedSearchableColumnsWeights,
			mode,
			searchTerm,
		} = this.props;
		const searchableColumns = isShowingNestedColumns
			? nestedSearchableColumns
			: searchCols;
		const weights = isShowingNestedColumns
			? nestedSearchableColumnsWeights
			: searchableColumnsWeights;

		return (
			<div css={{ position: 'relative' }}>
				<DataSearch
					componentId="GlobalSearch"
					autosuggest={false}
					dataField={searchableColumns}
					fieldWeights={weights}
					defaultSelected={searchTerm}
					showIcon={false}
					highlight={mode === MODES.VIEW}
					queryFormat="and"
					onValueChange={this.handleSearchValueChange}
					style={{
						visibility: 'hidden',
						width: 0,
						height: 0,
					}}
				/>
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

const mapDispatchToProps = {
	updateReactiveList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(GlobalSearch);
