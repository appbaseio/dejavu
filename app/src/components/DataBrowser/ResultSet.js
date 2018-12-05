// @flow

import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { mediaMin } from '@divyanshu013/media';
import { Spin } from 'antd';

import DataTable from '../DataTable';
import Flex from '../Flex';

import { numberWithCommas, getUrlParams } from '../../utils';
import { getSort } from '../../reducers/sort';
import { getPageSize } from '../../reducers/pageSize';
import { getAppname } from '../../reducers/app';
import { getReactiveListKey } from '../../reducers/data';
import {
	getTermsAggregationColumns,
	getMappings,
} from '../../reducers/mappings';
import { setSelectedRows, setUpdatingRow } from '../../actions';

type Props = {
	reactiveListKey: number,
	sortField: string,
	sortOrder: string,
	pageSize: number,
	termsAggregationColumns: any,
	onSelectedRows: any => void,
	onSetUpdatingRow: any => void,
	mappings: any,
	appname: string,
};

const ResultSet = ({
	reactiveListKey,
	sortField,
	sortOrder,
	pageSize,
	termsAggregationColumns,
	onSelectedRows,
	onSetUpdatingRow,
	mappings,
	appname,
}: Props) => {
	const { results } = getUrlParams(window.location.search);
	const currentPage = parseInt(results || 1, 10);

	return (
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
			react={{
				and: [
					'GlobalSearch',
					...termsAggregationColumns,
					'indexField',
					'typeField',
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
						backgroundColor: '#1890ff !important',
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
						key={data.length ? data[0]._id : '0'}
						data={data}
						mappings={mappings[appname]}
					/>
				) : null
			}
			onResultStats={total => (
				<Flex
					justifyContent="center"
					alignItems="center"
					css={{
						display: 'none',
						[mediaMin.medium]: {
							display: 'block',
							position: 'absolute',
							bottom: '-45px',
							right: '330px',
							height: '32px',
							fontSize: '14px',
							padding: '0 15px',
							lineHeight: '1.5',
							textAlign: 'center',
						},
					}}
				>
					<b>{numberWithCommas(total)}</b>
					&nbsp;results
				</Flex>
			)}
		/>
	);
};

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
	};
};

const mapDispatchToProps = {
	onSelectedRows: setSelectedRows,
	onSetUpdatingRow: setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ResultSet);
