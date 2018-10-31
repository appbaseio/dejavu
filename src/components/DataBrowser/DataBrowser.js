// @flow

import React, { Component } from 'react';
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
						<div css={{ position: 'relative' }}>
							<ReactiveBase
								app={indexes.join(',')}
								type={types.join(',')}
								credentials={credentials}
								url={url}
							>
								<div css={{ marginRight: '37px' }}>
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
													height: 32px !important;
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
								</div>
								<Flex
									id="result-list"
									css={{
										overflow: 'auto',
										borderRadius: '4px',
										margin: '20px 0',
										minHeight: '100px',
										maxHeight: '450px',
										border: `1px solid ${
											colors.tableBorderColor
										}`,
										marginRight: '37px',
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
										showResultStats
										react={{
											and: ['GlobalSearch'],
										}}
										innerClass={{
											poweredBy: css`
												display: none;
											`,
										}}
										loader={
											<Flex
												justifyContent="center"
												css={{
													position: 'absolute',
													bottom: 0,
													left: '50%',
													zIndex: 100,
												}}
											>
												<Spin />
											</Flex>
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
											/>
										)}
										onQueryChange={(
											prevQuery,
											nextQuery,
										) => {
											console.log('prevQuery', prevQuery);
											console.log('nextQuery', nextQuery);
										}}
										onResultStats={total => (
											<Flex
												justifyContent="center"
												alignItems="center"
												css={{
													position: 'absolute',
													top: '0',
													left: '330px',
													height: '32px',
													fontSize: '14px',
													padding: '0 15px',
													lineHeight: '1.5',
													textAlign: 'center',
												}}
											>
												Found &nbsp; <b>{total}</b>
												&nbsp;results
											</Flex>
										)}
									/>
								</Flex>
							</ReactiveBase>
							<AddRowModal />
						</div>
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
