// @flow

import React from 'react';
import { func } from 'prop-types';
import { Button, Select, Tag, Icon } from 'antd';

import Flex from '../Flex';
import AddFieldModal from './AddFieldModal';
import ShowHideColumn from './ShowHideColumns';
import ModeSwitch from './ModeSwitch';
import ExportData from './ExportData';

const { Option } = Select;

type Props = {
	onReload: () => void,
	onPageSizeChange: any => void,
	defaultPageSize: number,
	sort?: string,
	sortField?: string,
	onResetSort: () => void,
};

const Actions = ({
	onReload,
	onPageSizeChange,
	defaultPageSize,
	sort,
	sortField,
	onResetSort,
}: Props) => (
	<div css={{ margin: '20px 0' }}>
		<Flex alignItems="flex-end" justifyContent="space-between">
			<div>
				<ExportData />
				<Button
					icon="reload"
					onClick={onReload}
					css={{ marginRight: '5px' }}
				>
					Reload
				</Button>
				<ModeSwitch />
				<AddFieldModal />
			</div>
			<div>
				{sortField !== '_score' && (
					<Tag closable onClose={onResetSort}>
						<Icon
							type={
								sort === 'asc'
									? 'sort-ascending'
									: 'sort-descending'
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
					<Option value={20}>20</Option>
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

export default Actions;
