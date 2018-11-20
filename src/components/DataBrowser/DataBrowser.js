// @flow

import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactiveList,
	DataSearch,
} from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object, number, arrayOf } from 'prop-types';
import { Skeleton, Spin, Icon, Popover } from 'antd';
import { css } from 'react-emotion';
import ScrollSync from 'react-virtualized/dist/commonjs/ScrollSync';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

import DataTable from '../DataTable';
import Flex from '../Flex';
import Actions from './Actions';
import AddRowModal from './AddRowModal';
import StyledCell from '../DataTable/StyledCell';
import MappingsDropdown from '../MappingsDropdown';
import TermFilter from '../DataTable/TermFilter';

import { fetchMappings } from '../../actions';
import { getAppname, getUrl } from '../../reducers/app';
import * as dataSelectors from '../../reducers/data';
import {
	getIsLoading,
	getMappings,
	getIndexes,
	getTypes,
	getSearchableColumns,
	getVisibleColumns,
} from '../../reducers/mappings';
import { parseUrl, numberWithCommas } from '../../utils';
import {
	getTermsAggregationColumns,
	getSortableTypes,
} from '../../utils/mappings';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getMode } from '../../reducers/mode';
import popoverContent from '../CommonStyles/popoverContent';

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
	visibleColumns: string[],
};

type State = {
	sortField: string,
	sort: string,
	pageSize: number,
	scrollToColumn: number,
};

const srotableTypes = getSortableTypes();

class DataBrowser extends Component<Props, State> {
	state = {
		sort: 'desc',
		sortField: '_score',
		pageSize: 20,
		scrollToColumn: 0,
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
	};

	handleSortChange = (sortField, scrollToColumn) => {
		this.setState(prevState => {
			if (prevState.sortField === sortField) {
				return {
					sort: prevState.sort === 'asc' ? 'desc' : 'asc',
					scrollToColumn,
				};
			}

			return {
				sort: 'asc',
				sortField,
				scrollToColumn,
			};
		});
	};

	resetSort = () => {
		this.setState({
			sort: 'desc',
			sortField: '_score',
			scrollToColumn: 0,
		});
	};

	renderHeaderCell = ({ columnIndex, key, style }) => {
		const { visibleColumns, mappings: propMappings, appname } = this.props;
		const { sort, sortField } = this.state;
		let col = '';
		if (columnIndex > 0) {
			col = visibleColumns[columnIndex - 1];
		} else {
			col = '_id';
		}

		const mappings = propMappings[appname];
		const termFilterColumns = getTermsAggregationColumns(mappings);

		if (columnIndex === 0) {
			return (
				<StyledCell
					style={style}
					key={key}
					css={{
						display: 'flex',
						justifyContet: 'left',
						alignItems: 'center',
					}}
				>
					<div
						css={{
							width: '15%',
						}}
					/>
					<Popover
						content={
							<div css={popoverContent}>
								Clicking on {`{...}`} displays the JSON data.
							</div>
						}
						trigger="click"
					>
						<span
							css={{
								cursor: 'pointer',
								maxWidth: '10%',
								minWidth: '10%',
							}}
						>{` {...} `}</span>
					</Popover>
					<div css={{ marginLeft: '10px' }}>_id</div>
				</StyledCell>
			);
		}

		const termFilterIndex =
			termFilterColumns.indexOf(col) > -1
				? termFilterColumns.indexOf(col)
				: termFilterColumns.indexOf(`${col}.raw`);

		return (
			<StyledCell style={style} key={key}>
				<Flex
					justifyContent="space-between"
					alignItems="center"
					css={{
						width: '100%',
					}}
				>
					<Flex alignItems="center">
						{mappings.properties[col] && (
							<MappingsDropdown
								mapping={mappings.properties[col]}
							/>
						)}
						<span css={{ marginLeft: '10px' }}>{col}</span>
					</Flex>
					{mappings.properties[col] &&
						mappings.properties[col].type &&
						srotableTypes.indexOf(mappings.properties[col].type) >
							-1 && (
							<Flex alignItems="center">
								{termFilterIndex > -1 && (
									<TermFilter
										field={
											termFilterColumns[termFilterIndex]
										}
									/>
								)}
								<button
									type="button"
									onClick={() => {
										this.handleSortChange(col, columnIndex);
									}}
									css={{
										outline: 0,
										height: '15px',
										width: '15px',
										border: 0,
										cursor: 'pointer',
										background: 'none',
									}}
								>
									{sortField.indexOf(col) === -1 && (
										<i
											className="fa fa-sort"
											css={{ fontSize: 15 }}
										/>
									)}
									{sortField.indexOf(col) > -1 && (
										<i
											className={
												sort === 'asc'
													? 'fa fa-caret-down'
													: 'fa fa-caret-up'
											}
											css={{ fontSize: 15 }}
										/>
									)}
								</button>
							</Flex>
						)}
				</Flex>
			</StyledCell>
		);
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
			visibleColumns,
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
		const { sort, sortField, pageSize, scrollToColumn } = this.state;

		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					!isDataLoading &&
					mappings && (
						<div>
							<ReactiveBase
								app={indexes.join(',')}
								type={types.join(',')}
								credentials={credentials}
								url={url}
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
											onValueChange={() => {
												this.setState({
													scrollToColumn: 0,
												});
											}}
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
									id="result-list"
									css={{
										marginTop: '20px',
									}}
								>
									<ScrollSync>
										{({ onScroll, scrollLeft }) => (
											<div>
												<AutoSizer disableHeight>
													{({ width }) => (
														<Grid
															style={{
																overflow:
																	'hidden !important',
															}}
															columnWidth={250}
															columnCount={
																visibleColumns.length +
																1
															}
															height={35}
															overscanColumnCount={
																0
															}
															cellRenderer={
																this
																	.renderHeaderCell
															}
															rowHeight={35}
															rowCount={1}
															scrollLeft={
																scrollLeft
															}
															width={
																width -
																scrollbarSize()
															}
															tabIndex={null}
														/>
													)}
												</AutoSizer>
												<ReactiveList
													key={String(
														reactiveListKey,
													)}
													componentId="results"
													dataField={sortField}
													sortBy={sort}
													pagination={false}
													scrollTarget="result-list"
													size={pageSize}
													showResultStats
													react={{
														and: [
															'GlobalSearch',
															...getTermsAggregationColumns(
																mappings[
																	appname
																],
															),
														],
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
																position:
																	'absolute',
																bottom: '-30px',
																left: '50%',
																zIndex: 100,
															}}
														>
															<Spin />
														</Flex>
													}
													onAllData={(
														data,
														streamed,
														onLoadMore,
													) => (
														<DataTable
															key={
																data.length
																	? data[0]
																			._id
																	: '0'
															}
															data={data}
															mappings={
																mappings[
																	appname
																]
															}
															handleSortChange={
																this
																	.handleSortChange
															}
															onLoadMore={
																onLoadMore
															}
															scrollToColumn={
																scrollToColumn
															}
															sort={sort}
															sortField={
																sortField
															}
															onScroll={onScroll}
														/>
													)}
													onResultStats={total => (
														<Flex
															justifyContent="center"
															alignItems="center"
															css={{
																position:
																	'absolute',
																top: '0',
																left: '330px',
																height: '32px',
																fontSize:
																	'14px',
																padding:
																	'0 15px',
																lineHeight:
																	'1.5',
																textAlign:
																	'center',
															}}
														>
															Found &nbsp;{' '}
															<b>
																{numberWithCommas(
																	total,
																)}
															</b>
															&nbsp;results
														</Flex>
													)}
												/>
											</div>
										)}
									</ScrollSync>
								</div>
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
	visibleColumns: getVisibleColumns(state),
	selectedRows: getSelectedRows(state),
	mode: getMode(state),
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
