// @flow

import React, { Fragment } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { mediaMin } from '@divyanshu013/media';

import Flex from '../Flex';
import ShowHideColumn from './ShowHideColumns';
import ModeSwitch from './ModeSwitch';
import ExportData from './ExportData';
import DeleteRows from './DeleteRows';
import UpdaeRow from './UpdateRow';
import PageSize from './PageSize';

import { getSelectedRows } from '../../reducers/selectedRows';
import { getUpdatingRow } from '../../reducers/updatingRow';
import { getUrlParams } from '../../utils';
import SortFilter from './SortFilter';

type Props = {
	onReload: () => void,
	selectedRows: string[],
	updatingRow?: any,
};

const Actions = ({ onReload, selectedRows, updatingRow }: Props) => {
	const { showActions } = getUrlParams(window.location.search);
	let areActionsVisisble = false;

	if (showActions && showActions === 'false') {
		areActionsVisisble = false;
	}
	return (
		<div
			css={{
				margin: '10px 0',
				display: 'none',
				[mediaMin.medium]: {
					display: 'block',
				},
			}}
		>
			<Flex alignItems="flex-end" justifyContent="space-between">
				<div>
					{selectedRows.length > 0 ? (
						<Fragment>
							<DeleteRows />
							{updatingRow && <UpdaeRow />}
						</Fragment>
					) : (
						<Fragment>
							{areActionsVisisble && <ExportData />}
							{areActionsVisisble && (
								<Button
									icon="reload"
									onClick={onReload}
									css={{ marginRight: '5px' }}
								>
									Reload
								</Button>
							)}
						</Fragment>
					)}
					{areActionsVisisble && <ModeSwitch />}
				</div>
				<Flex alignItems="center">
					<SortFilter />
					<PageSize />
					<ShowHideColumn />
				</Flex>
			</Flex>
		</div>
	);
};

const mpaStateToProps = state => ({
	selectedRows: getSelectedRows(state),
	updatingRow: getUpdatingRow(state),
});

export default connect(mpaStateToProps)(Actions);
