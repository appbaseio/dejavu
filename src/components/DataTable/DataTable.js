import React from 'react';
import { Table, Alert } from 'antd';
import { arrayOf, object, shape, string, number, func } from 'prop-types';
import { css } from 'react-emotion';
import { connect } from 'react-redux';

import MappingsDropdown from '../MappingsDropdown';
import MappingsIcon from '../MappingsIcon';
import Cell from '../Cell';

import { getActiveCell, getError } from '../../reducers/cell';
import { setCellActive, setCellValueRequest } from '../../actions';
import { extractColumns } from './utils';

const DataTable = ({
	activeCell,
	data,
	mappings,
	setCellActive: setCellActiveDispatch,
	setCellValue,
	error,
}) => {
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
				padding: '10px !important',
				span: {
					display: 'flex',
					alignItems: 'center',
				},
			}),
		}),
		render: (text, record, row) => (
			<Cell
				row={row}
				column={property}
				record={record}
				active={
					activeCell.row === row && activeCell.column === property
				}
				onFocus={setCellActiveDispatch}
				onChange={setCellValue}
			>
				{text}
			</Cell>
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
						width: 230,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						padding: 10,
					}}
				>
					{text}
				</div>
			),
		},
		...columns,
	];
	return (
		<>
			{error && <Alert type="error" message={error} banner />}
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
					'.ant-table-tbody > tr > td': {
						padding: 0,
					},
				}}
			/>
		</>
	);
};

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
	activeCell: shape({ row: number, column: string }),
	setCellActive: func.isRequired,
	setCellValue: func.isRequired,
	error: string,
};

const mapStateToProps = state => ({
	activeCell: getActiveCell(state),
	error: getError(state),
});

const mapDispatchToProps = {
	setCellActive,
	setCellValue: setCellValueRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
