import React from 'react';
import { Table } from 'antd';
import { arrayOf, object } from 'prop-types';
import { css } from 'react-emotion';

import MappingsDropdown from '../MappingsDropdown';
import MappingsIcon from '../MappingsIcon';

import { extractColumns } from './utils';

const DataTable = ({ data, mappings }) => {
	const columns = extractColumns(mappings).map(property => ({
		key: property,
		dataIndex: property,
		title: property,
		filterDropdown: (
			<MappingsDropdown mapping={mappings.properties[property]} />
		),
		width: 250,
		filterIcon: <MappingsIcon mapping={mappings.properties[property]} />,
		onHeaderCell: () => ({
			className: css({
				span: {
					display: 'flex',
					alignItems: 'center',
				},
			}),
		}),
		render: text => (
			<div
				css={{
					width: 217,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
		),
	}));
	const columnsWithId = [
		{
			key: '_id',
			dataIndex: '_id',
			title: '_id',
			fixed: 'left',
			width: 250,
			render: text => (
				<div
					css={{
						width: 217,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{text}
				</div>
			),
		},
		...columns,
	];
	return (
		<Table
			bordered
			columns={columnsWithId}
			dataSource={data}
			rowKey="_id"
			pagination={false}
			loading={!data.length}
			scroll={{
				x: true,
			}}
			size="medium"
			css={{
				'.ant-table td': { whiteSpace: 'nowrap' },
			}}
		/>
	);
};

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
};

export default DataTable;
