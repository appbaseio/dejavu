// @flow

import React, { Component, Fragment } from 'react';
import {
	ReactiveBase,
	ReactiveList,
	DataSearch,
} from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object, number, arrayOf } from 'prop-types';
import { Skeleton, Spin, Icon } from 'antd';
import { css } from 'react-emotion';

import DataTable from '../DataTable';
import Flex from '../Flex';
import Actions from './Actions';
import AddRowModal from './AddRowModal';

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

type Props = {
	appname: string,
	url: string,
	fetchMappings: () => void,
	isLoading: boolean,
	mappings: object,
	reactiveListKey: number,
	isDataLoading: boolean,
	indexes: string[],
	types: string[],
	searchableColumns: string[],
};

type State = {
	sortField: string,
	sort: string,
};

class DataBrowser extends Component<Props, State> {
	state = {
		sort: 'asc',
		sortField: '_score',
	};

	componentDidMount() {
		this.props.fetchMappings();
	}

	handleReload = () => {
		this.props.fetchMappings();
	};

	handleSortChange = sortField => {
		this.setState(prevState => {
			if (prevState.sortField === sortField) {
				return {
					sort: prevState.sort === 'asc' ? 'desc' : 'asc',
				};
			}

			return {
				sort: 'asc',
				sortField,
			};
		});
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
		const { sort, sortField } = this.state;

		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					!isDataLoading &&
					mappings && (
						<Fragment>
							<ReactiveBase
								app={indexes.join(',')}
								type={types.join(',')}
								credentials={credentials}
								url={url}
							>
								<Actions onReload={this.handleReload} />
								<div css={{ position: 'relative' }}>
									<DataSearch
										componentId="GlobalSearch"
										autosuggest={false}
										dataField={searchColumns}
										fieldWeights={weights}
										innerClass={{
											input: `ant-input ${css`
												padding-left: 35px !important;
											`}`,
										}}
										showIcon={false}
										highlight
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
								<div
									id="result-list"
									css={{
										overflow: 'auto',
										borderRadius: '4px',
										margin: '20px 0',
										minHeight: '100px',
										maxHeight: '450px',
										position: 'relative',
										border: `1px solid ${
											colors.tableBorderColor
										}`,
									}}
								>
									<ReactiveList
										key={String(reactiveListKey)}
										componentId="results"
										dataField={sortField}
										sortBy={sort}
										scrollTarget="result-list"
										pagination={false}
										size={20}
										showResultStats={false}
										react={{
											and: ['GlobalSearch'],
										}}
										innerClass={{
											poweredBy: css`
												display: none;
											`,
										}}
										loader={
											<div
												css={{
													margin: 'auto',
													position: 'absolute',
													top: '50%',
													transform:
														'translateY(-50%)',
													left: '10px',
													display: 'block',
												}}
											>
												<Spin />
											</div>
										}
										onAllData={data => (
											<DataTable
												key={
													data.length
														? data[0]._id
														: '0'
												}
												data={data}
												mappings={mappings[appname]}
												handleSortChange={
													this.handleSortChange
												}
												sort={sort}
											/>
										)}
										onQueryChange={(
											prevQuery,
											nextQuery,
										) => {
											console.log('prevQuery', prevQuery);
											console.log('nextQuery', nextQuery);
										}}
									/>
								</div>
							</ReactiveBase>
							<AddRowModal />
						</Fragment>
					)}
				{(isLoading || isDataLoading) && (
					<Flex css={{ marginTop: '20px' }} justifyContent="center">
						<Spin />
					</Flex>
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
	indexes: arrayOf(string).isRequired,
	types: arrayOf(string).isRequired,
	searchableColumns: arrayOf(string),
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
