import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactiveList,
	DataSearch,
} from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object, number, arrayOf } from 'prop-types';
import { Skeleton, Spin } from 'antd';

import DataTable from '../DataTable';
import Flex from '../Flex';
import Actions from './Actions';

import { fetchMappings } from '../../actions';
import { getAppname, getUrl } from '../../reducers/app';
import * as dataSelectors from '../../reducers/data';
import {
	getIsLoading,
	getMappings,
	getIndexes,
	getTypes,
	getSearchableColumns,
} from '../../reducers/mappings';
import { parseUrl } from '../../utils';
import colors from '../theme/colors';

class DataBrowser extends Component {
	componentDidMount() {
		this.props.fetchMappings();
	}

	handleReload = () => {
		this.props.fetchMappings();
	};

	render() {
		const {
			appname,
			url: rawUrl,
			isLoading,
			mappings,
			reactiveListKey,
			isDataLoading,
			indexes,
			types,
			searchableColumns,
		} = this.props;
		const { credentials, url } = parseUrl(rawUrl);
		const searchColumns = [
			...searchableColumns,
			...searchableColumns.map(field => `${field}.raw`),
			...searchableColumns.map(field => `${field}.search`),
			...searchableColumns.map(field => `${field}.autosuggest`),
		];
		const weights = [
			...Array(searchableColumns.length).fill(3),
			...Array(searchableColumns.length).fill(1),
			...Array(searchableColumns.length).fill(1),
			...Array(searchableColumns.length).fill(1),
		];
		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					!isDataLoading &&
					mappings && (
						<ReactiveBase
							app={indexes.join(',')}
							type={types.join(',')}
							credentials={credentials}
							url={url}
						>
							<Actions onReload={this.handleReload} />
							<DataSearch
								componentId="GlobalSearch"
								autosuggest={false}
								dataField={searchColumns}
								fieldWeights={weights}
								innerClass={{
									input: 'ant-input',
								}}
							/>
							<div
								id="result-list"
								css={{
									maxHeight: '450px',
									overflow: 'auto',
									border: `1px solid ${
										colors.tableBorderColor
									}`,
									borderRadius: '4px',
									margin: '20px 0',
								}}
							>
								<ReactiveList
									key={String(reactiveListKey)}
									componentId="results"
									dataField="_id"
									scrollTarget="result-list"
									pagination={false}
									showResultStats={false}
									size={20}
									react={{
										and: ['GlobalSearch'],
									}}
									loader={
										<Flex
											style={{ marginTop: '20px' }}
											justifyContent="center"
										>
											<Spin />
										</Flex>
									}
									onAllData={data => (
										<DataTable
											key={
												data.length ? data[0]._id : '0'
											}
											data={data}
											mappings={mappings[appname]}
										/>
									)}
								/>
							</div>
						</ReactiveBase>
					)}
			</Skeleton>
		);
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
	isLoading: getIsLoading(state),
	mappings: getMappings(state),
	reactiveListKey: dataSelectors.getReactiveListKey(state),
	isDataLoading: dataSelectors.getIsLoading(state),
	indexes: getIndexes(state),
	types: getTypes(state),
	searchableColumns: getSearchableColumns(state),
});

const mapDispatchToProps = {
	fetchMappings,
};

DataBrowser.propTypes = {
	appname: string.isRequired,
	url: string.isRequired,
	fetchMappings: func.isRequired,
	isLoading: bool.isRequired,
	mappings: object,
	reactiveListKey: number.isRequired,
	isDataLoading: bool.isRequired,
	indexes: arrayOf(string),
	types: arrayOf(string),
	searchableColumns: arrayOf(string),
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
