import React from 'react';
import { Table } from 'antd';
import { arrayOf, object } from 'prop-types';

import MappingsDropdown from '../MappingsDropdown';
import MappingsIcon from '../MappingsIcon';

import { extractColumns } from './utils';

const DataTable = ({ data, mappings }) => {
	const columns = extractColumns(mappings).map(property => ({
		key: property,
		dataIndex: property,
		title: property,
		width: 300,
		filterDropdown: (
			<MappingsDropdown mapping={mappings.properties[property]} />
		),
		filterIcon: <MappingsIcon mapping={mappings.properties[property]} />,
	}));
	return (
		<Table
			bordered
			columns={columns}
			dataSource={data}
			rowKey="_id"
			pagination={false}
			loading={!data.length}
			scroll={{
				x: true,
				y: 600,
			}}
		/>
	);
};

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
};

export default DataTable;
