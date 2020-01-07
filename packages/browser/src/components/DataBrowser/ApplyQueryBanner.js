// @flow

import React from 'react';
import { Alert } from 'antd';
import { connect } from 'react-redux';

import { setApplyQuery, setSelectedRows, setSelectAll } from '../../actions';
import { getApplyQuery } from '../../reducers/applyQuery';
import { getSelectAll } from '../../reducers/selectAll';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getStats } from '../../reducers/stats';
import { numberWithCommas } from '../../utils';
import linkButton from '../CommonStyles/linkButton';

type Props = {
	applyQuery: boolean,
	selectAll: boolean,
	selectedRows: string[],
	onSetApplyQuery: boolean => void,
	onSetSelectAll: boolean => void,
	onSetSelectedRows: any => void,
	stats: any,
};

const ApplyQueryBanner = ({
	applyQuery,
	selectAll,
	selectedRows,
	onSetApplyQuery,
	onSetSelectAll,
	onSetSelectedRows,
	stats,
}: Props) => (
	<>
		{applyQuery && (
			<Alert
				css={{ marginTop: 15 }}
				message={
					<div css={{ textAlign: 'center' }}>
						All {numberWithCommas(stats.totalResults)} docs are
						selected
						<button
							type="button"
							css={linkButton}
							onClick={() => {
								onSetSelectedRows([]);
								onSetSelectAll(false);
								onSetApplyQuery(false);
							}}
						>
							Clear selection
						</button>
					</div>
				}
				type="info"
			/>
		)}

		{selectAll && (
			<Alert
				css={{ marginTop: 15 }}
				message={
					<div css={{ textAlign: 'center' }}>
						All {selectedRows.length} docs from current page are
						selected.{' '}
						<button
							type="button"
							css={linkButton}
							onClick={() => {
								onSetSelectAll(false);
								onSetApplyQuery(true);
							}}
						>
							Select all {numberWithCommas(stats.totalResults)}{' '}
							docs instead
						</button>
					</div>
				}
				type="info"
			/>
		)}
	</>
);

const mapStateToProps = state => ({
	applyQuery: getApplyQuery(state),
	selectAll: getSelectAll(state),
	selectedRows: getSelectedRows(state),
	stats: getStats(state),
});

const mapDispatchToProps = {
	onSetApplyQuery: setApplyQuery,
	onSetSelectedRows: setSelectedRows,
	onSetSelectAll: setSelectAll,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyQueryBanner);
