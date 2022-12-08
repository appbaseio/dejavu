// @flow

import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import styled, { css } from 'react-emotion';
import { mediaMin } from '@divyanshu013/media';

import DataTable from '../DataTable';
import Flex from '../Flex';
import Loader from '../Loader';

import { numberWithCommas, getUrlParams } from '../../utils';
import { getSort } from '../../reducers/sort';
import { getPageSize } from '../../reducers/pageSize';
import { getAppname } from '../../reducers/app';
import { getReactiveListKey } from '../../reducers/data';
import { getVersion } from '../../reducers/version';
import {
	getTermsAggregationColumns,
	getMappings,
} from '../../reducers/mappings';
import {
	setSelectedRows,
	setUpdatingRow,
	setQuery,
	setSelectAll,
	setApplyQuery,
	setStats,
} from '../../actions';
import colors from '../theme/colors';
import { getMode } from '../../reducers/mode';

const InfoContainer = styled(Flex)`
	min-height: 150px;
	position: absolute;
	top: 0;
	left: 2px;
	right: 2px;
	bottom: 2px
	z-index: 1000px;
	background: ${colors.white};
`;

type Props = {
	reactiveListKey: number,
	sortField: string,
	sortOrder: string,
	pageSize: number,
	termsAggregationColumns: any,
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	onSetQuery: any => void,
	mappings: any,
	appname: string,
	height: number,
	width: number,
	headerRef: any,
	onSetSelectAll: boolean => void,
	onSetApplyQuery: boolean => void,
	onSetStats: any => void,
	version: number,
	mode: string,
};

type State = {
	hasMounted: boolean,
};

const StyledInfoContainer = styled(InfoContainer)`
	z-index: 1000;
	height: 100%;
	width: 100%;
`;
const StyledLoader = styled(Loader)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

class ResultSet extends React.Component<Props, State> {
	state = {
		hasMounted: true,
	};

	shouldComponentUpdate(nextProps) {
		if (
			nextProps.reactiveListKey !== this.props.reactiveListKey ||
			nextProps.mode !== this.props.mode
		) {
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

	render() {
		const {
			reactiveListKey,
			sortField,
			sortOrder,
			pageSize,
			termsAggregationColumns,
			onSelectedRows,
			onSetUpdatingRow,
			onSetQuery,
			mappings,
			appname,
			height,
			width,
			headerRef,
			onSetSelectAll,
			onSetApplyQuery,
			onSetStats,
			version,
		} = this.props;

		const { results } = getUrlParams(window.location.search);
		const currentPage = parseInt(results || 1, 10);
		const { hasMounted } = this.state;
		const defaultSort = [
			{
				[sortField]: { order: sortOrder },
			},
		];
		if (version < 8) {
			defaultSort[0]._id = {
				order: sortOrder,
				unmapped_type: 'long',
			};
		}
		const defaultQuery = {
			sort: defaultSort,
		};

		if (version >= 7) {
			// $FlowFixMe
			defaultQuery.track_total_hits = true;
		}
		return (
			hasMounted && (
				<ReactiveList
					key={String(reactiveListKey)}
					componentId="results"
					dataField={sortField}
					sortBy={sortOrder}
					pagination
					size={pageSize}
					showResultStats
					URLParams
					currentPage={currentPage}
					defaultQuery={() => defaultQuery}
					react={{
						and: [
							'GlobalSearch',
							...termsAggregationColumns,
							'indexField',
							'typeField',
						],
					}}
					style={{
						position: 'relative',
						overflow: 'visible',
					}}
					innerClass={{
						poweredBy: css({
							display: 'none',
						}),
						pagination: css({
							position: 'fixed',
							right: 40,
							zIndex: 105,
							'.active': {
								backgroundColor: `${colors.primary} !important`,
							},
						}),
					}}
					onPageChange={() => {
						onSelectedRows([]);
						onSetUpdatingRow(null);
						onSetSelectAll(false);
						onSetApplyQuery(false);
					}}
					onData={({ resultStats }) => {
						const { numberOfResults, ...rest } = resultStats;
						onSetStats({
							totalResults:
								typeof numberOfResults === 'object'
									? numberOfResults.value
									: numberOfResults,
							...rest,
						});
					}}
					renderResultStats={stats => (
						<Flex
							justifyContent="center"
							alignItems="center"
							css={{
								display: 'none',
								[mediaMin.medium]: {
									display: 'block',
									position: 'absolute',
									right: '390px',
									height: '32px',
									fontSize: '14px',
									padding: '0 15px',
									lineHeight: '1.5',
									textAlign: 'center',
									bottom: -45,
								},
							}}
						>
							Showing{' '}
							<b>{numberWithCommas(stats.displayedResults)}</b> of
							total{' '}
							<b>
								{numberWithCommas(
									typeof stats.numberOfResults === 'object'
										? stats.numberOfResults.value
										: stats.numberOfResults,
								)}
							</b>
						</Flex>
					)}
					onQueryChange={(prevQuery, nextQuery) => {
						onSetQuery(nextQuery);
						onSetSelectAll(false);
						onSetApplyQuery(false);
					}}
				>
					{({ data, loading }) => (
						<>
							{loading && (
								<StyledInfoContainer
									justifyContent="center"
									id="spinner"
								>
									<StyledLoader />
								</StyledInfoContainer>
							)}
							{data && data.length ? (
								<DataTable
									key={data.length ? data[0]._id : '0'}
									data={data}
									mappings={mappings[appname]}
									height={height}
									width={width}
									headerRef={headerRef}
								/>
							) : null}
						</>
					)}
				</ReactiveList>
			)
		);
	}
}

const mapStateToProps = state => {
	const { field: sortField, order: sortOrder } = getSort(state);
	return {
		appname: getAppname(state),
		termsAggregationColumns: getTermsAggregationColumns(state),
		sortField,
		sortOrder,
		pageSize: getPageSize(state),
		reactiveListKey: getReactiveListKey(state),
		mappings: getMappings(state),
		version: getVersion(state),
		mode: getMode(state),
	};
};

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
	onSetQuery: setQuery,
	onSetSelectAll: setSelectAll,
	onSetApplyQuery: setApplyQuery,
	onSetStats: setStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultSet);
