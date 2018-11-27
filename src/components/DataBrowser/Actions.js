// @flow

import React, { Fragment } from 'react';
import { Button, Select } from 'antd';
import { connect } from 'react-redux';
import { mediaMin } from '@divyanshu013/media';
import { SelectedFilters } from '@appbaseio/reactivesearch';

import Flex from '../Flex';
import ShowHideColumn from './ShowHideColumns';
import ModeSwitch from './ModeSwitch';
import ExportData from './ExportData';
import DeleteRows from './DeleteRows';
import UpdaeRow from './UpdateRow';

import { getSelectedRows } from '../../reducers/selectedRows';
import { getUpdatingRow } from '../../reducers/updatingRow';
import colors from '../theme/colors';
import overflowStyles from '../CommonStyles/overflowText';

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
	isShowingNestedColumns: boolean,
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
	isShowingNestedColumns,
}: Props) => (
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
			<Flex alignItems="center">
				<SelectedFilters
					css={{
						marginRight: 5,
					}}
				/>
				{sortField !== '_score' && (
					<Flex
						alignItems="center"
						css={{
							marginRight: 5,
							background: colors.background,
							minHeight: 30,
							borderRadius: 3,
							padding: '5px 8px',
							lineHeight: '1.2rem',
							maxWidth: 200,
							fontSize: 13,
							'&:hover': {
								backgroundColor: colors.hoverBackground,
								color: colors.hoverLink,
								span: {
									textDecoration: 'line-through',
								},
							},
						}}
						className={overflowStyles}
					>
						<i
							className={
								sort === 'asc'
									? 'fa fa-sort-alpha-asc'
									: 'fa fa-sort-alpha-desc'
							}
						/>
						<span
							css={{
								padding: '0 8px',
								maxWidth: '80%',
							}}
							className={overflowStyles}
						>
							{(sortField || '').split('.')[0]}
						</span>
						<button
							type="button"
							css={{
								outline: 0,
								border: 0,
								cursor: 'pointer',
								background: 'none',
							}}
							onClick={onResetSort}
						>
							✕
						</button>
					</Flex>
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
				<ShowHideColumn
					isShowingNestedColumns={isShowingNestedColumns}
				/>
			</Flex>
		</Flex>
	</div>
);

const mpaStateToProps = state => ({
	selectedRows: getSelectedRows(state),
	updatingRow: getUpdatingRow(state),
});

export default connect(mpaStateToProps)(Actions);
