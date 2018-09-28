import React from 'react';
import { Table } from 'antd';
import { arrayOf, object } from 'prop-types';

import { extractColumns } from './utils';

const DataTable = ({ data, mappings }) => (
	<Table
		bordered
		columns={extractColumns(mappings)}
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

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
};

export default DataTable;
