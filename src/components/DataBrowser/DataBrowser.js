// @flow

import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactiveList,
	DataSearch,
} from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object, number, arrayOf, array } from 'prop-types';
import { Skeleton, Spin, Icon } from 'antd';
import { css } from 'react-emotion';
import { mediaMin } from '@divyanshu013/media';

import DataTable from '../DataTable';
import Flex from '../Flex';
import Actions from './Actions';
import AddRowModal from './AddRowModal';
import AddFieldModal from './AddFieldModal';
import DataTableHeader from './DataTableHeader';

import {
	fetchMappings,
	setSelectedRows,
	setUpdatingRow,
	updateReactiveList,
} from '../../actions';
import { getAppname, getUrl, getHeaders } from '../../reducers/app';
import * as dataSelectors from '../../reducers/data';
import {
	getIsLoading,
	getMappings,
	getIndexes,
	getTypes,
	getSearchableColumns,
} from '../../reducers/mappings';
import {
	parseUrl,
	numberWithCommas,
	getUrlParams,
	convertArrayToHeaders,
} from '../../utils';
import { getTermsAggregationColumns } from '../../utils/mappings';
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
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	headers: any[],
	onUpdateReactiveList: () => void,
};

type State = {
	sortField: string,
	sort: string,
	pageSize: number,
};

class DataBrowser extends Component<Props, State> {
	totalRes = 0;

	currentIds = [];

	state = {
		sort: 'desc',
		sortField: '_score',
		pageSize: 15,
	};

	componentDidMount() {
		this.props.fetchMappings();
	}

	handleReload = () => {
		this.props.fetchMappings();
	};

	handlePageSizeChange = pageSize => {
		this.setState({
			pageSize,
		});
		this.props.onUpdateReactiveList();
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

	resetSort = () => {
		this.setState({
			sort: 'desc',
			sortField: '_score',
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
			onSelectedRows,
			onSetUpdatingRow,
			headers,
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
			...Array(searchableColumns.length).fill(3),
			...Array(searchableColumns.length).fill(1),
			...Array(searchableColumns.length).fill(1),
		];
		const { sort, sortField, pageSize } = this.state;
		const { results } = getUrlParams(window.location.search);
		const currentPage = parseInt(results || 1, 10);
		const otherBaseProps = headers.length
			? { headers: convertArrayToHeaders(headers) }
			: {};

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
								{...otherBaseProps}
							>
								<div>
									<Actions
										onReload={this.handleReload}
										onPageSizeChange={
											this.handlePageSizeChange
										}
										defaultPageSize={pageSize}
										sort={sort}
										sortField={sortField}
										onResetSort={this.resetSort}
									/>
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
								</div>
								<div
									css={{
										position: 'relative',
									}}
								>
									<div
										id="result-list"
										css={{
											marginTop: '20px',
											border: `1px solid ${
												colors.tableBorderColor
											}`,
											borderRadius: 3,
											widht: '100%',
											maxHeight: window.innerHeight - 300,
											overflowX: 'auto',
										}}
									>
										<DataTableHeader
											sort={sort}
											sortField={sortField}
											handleSort={this.handleSortChange}
										/>
										<ReactiveList
											key={String(reactiveListKey)}
											componentId="results"
											dataField={sortField}
											sortBy={sort}
											pagination
											size={pageSize}
											showResultStats
											URLParams
											currentPage={currentPage}
											react={{
												and: [
													'GlobalSearch',
													...getTermsAggregationColumns(
														mappings[appname],
													),
												],
											}}
											innerClass={{
												poweredBy: css`
													display: none;
												`,
												pagination: css({
													position: 'absolute',
													bottom: '-100px',
													right: 0,
													zIndex: 105,
													'.active': {
														backgroundColor:
															'#1890ff !important',
													},

													[mediaMin.medium]: {
														bottom: '-50px',
													},
												}),
											}}
											loader={
												<Flex
													justifyContent="center"
													css={{
														position: 'fixed',
														bottom: '-80px',
														left: '50%',
														zIndex: 1000,
													}}
													id="spinner"
												>
													<Spin />
												</Flex>
											}
											onPageChange={() => {
												onSelectedRows([]);
												onSetUpdatingRow(null);
											}}
											onAllData={data =>
												data.length ? (
													<DataTable
														key={
															data.length
																? data[0]._id
																: '0'
														}
														data={data}
														mappings={
															mappings[appname]
														}
														pageSize={pageSize}
													/>
												) : null
											}
											onResultStats={total => {
												this.totalRes = total;
												return (
													<Flex
														justifyContent="center"
														alignItems="center"
														css={{
															display: 'none',
															[mediaMin.medium]: {
																display:
																	'block',
																position:
																	'absolute',
																bottom: '-45px',
																right: '330px',
																height: '32px',
																fontSize:
																	'14px',
																padding:
																	'0 15px',
																lineHeight:
																	'1.5',
																textAlign:
																	'center',
															},
														}}
													>
														<b>
															{numberWithCommas(
																total,
															)}
														</b>
														&nbsp;results
													</Flex>
												);
											}}
										/>
									</div>
								</div>
							</ReactiveBase>
							<Flex
								css={{
									marginTop: 100,
									[mediaMin.medium]: {
										marginTop: 10,
									},
								}}
								wrap="no-wrap"
							>
								<AddRowModal />
								<AddFieldModal />
							</Flex>
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
	headers: getHeaders(state),
});

const mapDispatchToProps = {
	fetchMappings,
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
	onUpdateReactiveList: updateReactiveList,
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
	headers: array,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
