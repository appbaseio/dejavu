import React from 'react';
import { Table } from 'antd';
import { arrayOf, object } from 'prop-types';

import { extractColumns } from './utils';

const DataTable = ({ data }) => (
	<Table
		columns={extractColumns(data)}
		dataSource={data}
		rowKey="_id"
		pagination={false}
	/>
);

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
};

export default DataTable;
