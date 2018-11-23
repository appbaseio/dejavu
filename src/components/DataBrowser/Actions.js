// @flow

import React, { Fragment } from 'react';
import { func } from 'prop-types';
import { Button, Select, Tag } from 'antd';
import { connect } from 'react-redux';
import { mediaMin } from '@divyanshu013/media';

import Flex from '../Flex';
import ShowHideColumn from './ShowHideColumns';
import ModeSwitch from './ModeSwitch';
import ExportData from './ExportData';
import DeleteRows from './DeleteRows';
import UpdaeRow from './UpdateRow';

import { getSelectedRows } from '../../reducers/selectedRows';
import { getUpdatingRow } from '../../reducers/updatingRow';

const { Option } = Select;

type Props = {
	onReload: () => void,
	onPageSizeChange: any => void,
	defaultPageSize: number,
	sort?: string,
	sortField?: string,
	onResetSort: () => void,
	selectedRows: string[],
	updatingRow?: any,
};

const Actions = ({
	onReload,
	onPageSizeChange,
	defaultPageSize,
	sort,
	sortField,
	onResetSort,
	selectedRows,
	updatingRow,
}: Props) => (
	<div
		css={{
			margin: '20px 0',
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
						<ExportData />
						<Button
							icon="reload"
							onClick={onReload}
							css={{ marginRight: '5px' }}
						>
							Reload
						</Button>
					</Fragment>
				)}
				<ModeSwitch />
			</div>
			<div>
				{sortField !== '_score' && (
					<Tag closable onClose={onResetSort}>
						<i
							className={
								sort === 'asc'
									? 'fa fa-sort-alpha-asc'
									: 'fa fa-sort-alpha-desc'
							}
						/>
						&nbsp; {(sortField || '').split('.')[0]}
					</Tag>
				)}
				<Select
					defaultValue={defaultPageSize}
					onChange={onPageSizeChange}
				>
					<Option value={10}>10</Option>
					<Option value={15}>15</Option>
					<Option value={25}>25</Option>
					<Option value={50}>50</Option>
					<Option value={100}>100</Option>
				</Select>
				<ShowHideColumn />
			</div>
		</Flex>
	</div>
);

Actions.propTypes = {
	onReload: func.isRequired,
};

const mpaStateToProps = state => ({
	selectedRows: getSelectedRows(state),
	updatingRow: getUpdatingRow(state),
});

export default connect(mpaStateToProps)(Actions);
