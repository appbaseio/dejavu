// @flow

import React from 'react';
import { Alert } from 'antd';
import { connect } from 'react-redux';

import { setApplyQuery, setSelectedRows, setSelectAll } from '../../actions';
import { getApplyQuery } from '../../reducers/applyQuery';
import { getSelectAll } from '../../reducers/selectAll';
import { getSelectedRows } from '../../reducers/selectedRows';
import linkButton from '../CommonStyles/linkButton';

type Props = {
	applyQuery: boolean,
	selectAll: boolean,
	selectedRows: string[],
	onSetApplyQuery: boolean => void,
	onSetSelectAll: boolean => void,
	onSetSelectedRows: any => void,
};

const ApplyQueryBanner = ({
	applyQuery,
	selectAll,
	selectedRows,
	onSetApplyQuery,
	onSetSelectAll,
	onSetSelectedRows,
}: Props) => (
	<>
		{applyQuery && (
			<Alert
				css={{ marginTop: 15 }}
				message={
					<div css={{ textAlign: 'center' }}>
						All records matching current view query will be
						selected.{' '}
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
							Select all docs based on current view query.
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
});

const mapDispatchToProps = {
	onSetApplyQuery: setApplyQuery,
	onSetSelectedRows: setSelectedRows,
	onSetSelectAll: setSelectAll,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ApplyQueryBanner);
