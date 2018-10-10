import React, { Component } from 'react';
import {
	Table,
	Alert,
	Button,
	Modal,
	List,
	Checkbox,
	Dropdown,
	Icon,
} from 'antd';
import { arrayOf, object, shape, string, number, func, bool } from 'prop-types';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import JsonInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { mediaMax, mediaMin } from '@divyanshu013/media';

import MappingsDropdown from '../MappingsDropdown';
import MappingsIcon from '../MappingsIcon';
import Cell from '../Cell';

import { getActiveCell, getError } from '../../reducers/cell';
import * as dataSelectors from '../../reducers/data';
import {
	setCellActive,
	setCellValueRequest,
	addDataRequest,
} from '../../actions';
import { extractColumns } from './utils';

const { Item } = List;
const { Group } = Checkbox;

// making DataTable stateful to update data from cell since onAllData is invoked only when data changes due to query
class DataTable extends Component {
	state = {
		data: this.props.data,
		showModal: false,
		addDataError: false,
		addDataValue: null,
		visibleColumns: extractColumns(this.props.mappings),
	};

	handleChange = (row, column, value) => {
		const { setCellValue } = this.props;
		const { data } = this.state;

		const nextData = [
			...data.slice(0, row),
			{
				...data[row],
				[column]: value,
			},
			...data.slice(row + 1),
		];
		this.setState({
			data: nextData,
		});
		const record = data[row];
		setCellValue(record._id, column, value);
	};

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	};

	handleJsonInput = ({ error, jsObject }) => {
		this.setState({ addDataError: Boolean(error), addDataValue: jsObject });
	};

	handleSelectAll = e => {
		const { mappings } = this.props;
		const { checked } = e.target;
		let visibleColumns;
		if (checked) {
			visibleColumns = extractColumns(mappings);
		} else {
			visibleColumns = [];
		}
		this.setState({ visibleColumns });
	};

	handleVisibleColumnsChange = visibleColumns => {
		this.setState({ visibleColumns }); // this would need an order since ant doesn't maintain it
	};

	addValue = () => {
		const { addDataError, addDataValue } = this.state;
		if (!addDataError && addDataValue) {
			this.toggleModal();
			this.props.addDataRequest(addDataValue);
		}
	};

	render() {
		const {
			activeCell,
			mappings,
			setCellActive: setCellActiveDispatch,
			error,
		} = this.props;
		const { data, showModal, addDataError, visibleColumns } = this.state;
		const { addDataIsLoading, addDataRequestError } = this.props;
		// current visible mappings are in state
		const columns = visibleColumns.map(property => ({
			key: property,
			dataIndex: property,
			title: property,
			filterDropdown: (
				<MappingsDropdown mapping={mappings.properties[property]} />
			),
			width: 250,
			filterIcon: (
				<MappingsIcon mapping={mappings.properties[property]} />
			),
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
					active={
						activeCell.row === row && activeCell.column === property
					}
					onFocus={setCellActiveDispatch}
					onChange={this.handleChange}
					mapping={mappings.properties[property]}
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
				<Dropdown
					// this should stay open when group is checked/unchecked by making controlled
					overlay={
						<div
							css={{
								background: '#fff',
								borderRadius: 4,
								padding: 10,
								boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
							}}
						>
							<Checkbox
								checked={
									visibleColumns.length ===
									extractColumns(mappings).length
								}
								indeterminate={
									visibleColumns.length <
										extractColumns(mappings).length &&
									visibleColumns.length
								}
								css={{
									marginBottom: 5,
									fontWeight: 'bold',
								}}
								onChange={this.handleSelectAll}
							>
								Select All
							</Checkbox>
							<Group
								options={extractColumns(mappings)}
								css={{ display: 'grid', gridGap: 5 }}
								value={visibleColumns}
								onChange={this.handleVisibleColumnsChange}
							/>
						</div>
					}
				>
					<Button css={{ margin: '20px 0' }}>
						Show/Hide Columns <Icon type="down" />
					</Button>
				</Dropdown>
				{error && <Alert type="error" message={error} banner />}
				{addDataRequestError && (
					<Alert type="error" message={addDataRequestError} banner />
				)}
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
						'.ant-table-body': {
							overflowX: 'auto !important',
						},
						'.ant-table-fixed': { minWidth: 'auto' },
						'.ant-table-tbody > tr > td': {
							padding: 0,
						},
						// if the css implementation causes lags on mobiles, we would need a js implementation on mobile screens to remove rendering this altogether
						[mediaMax.medium]: {
							display: 'none',
						},
					}}
				/>
				<List
					itemLayout="horizontal"
					dataSource={data}
					renderItem={item => (
						<Item>
							<Item.Meta
								title={item._id}
								description={<div>Oasis</div>} // just need to render the items here instead of Oasis (the greatest rock and roll band)
							/>
						</Item>
					)}
					css={{
						// a css only implementation currently
						[mediaMin.medium]: {
							display: 'none',
						},
					}}
				/>
				<Button
					icon="plus"
					type="primary"
					css={{ marginTop: 10 }}
					onClick={this.toggleModal}
					loading={addDataIsLoading}
				>
					Add Row
				</Button>
				<Modal
					visible={showModal}
					onCancel={this.toggleModal}
					onOk={this.addValue}
					okButtonProps={{ disabled: addDataError }}
				>
					<JsonInput
						id="add-row-modal"
						locale={locale}
						placeholder={{}}
						theme="light_mitsuketa_tribute"
						style={{ outerBox: { marginTop: 20 } }}
						onChange={this.handleJsonInput}
					/>
				</Modal>
			</>
		);
	}
}

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
	activeCell: shape({ row: number, column: string }),
	setCellActive: func.isRequired,
	setCellValue: func.isRequired,
	addDataRequest: func.isRequired,
	error: string,
	addDataRequestError: string,
	addDataIsLoading: bool.isRequired,
};

const mapStateToProps = state => ({
	activeCell: getActiveCell(state),
	error: getError(state),
	addDataRequestError: dataSelectors.getError(state),
	addDataIsLoading: dataSelectors.getIsLoading(state),
});

const mapDispatchToProps = {
	setCellActive,
	setCellValue: setCellValueRequest,
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
