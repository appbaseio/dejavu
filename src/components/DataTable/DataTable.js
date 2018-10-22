import React, { Component, Fragment } from 'react';
import { Table, Alert, Button, List, Checkbox, Dropdown, Icon } from 'antd';
import { arrayOf, object, shape, string, number, func, bool } from 'prop-types';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { mediaMax, mediaMin } from '@divyanshu013/media';

import MappingsDropdown from '../MappingsDropdown';
import MappingsIcon from '../MappingsIcon';
import Cell from '../Cell';
import AddRowModal from '../AddRowModal';

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

const META_FIELDS = ['_index', '_type', '_id'];

// making DataTable stateful to update data from cell since onAllData is invoked only when data changes due to query
class DataTable extends Component {
	metaFields = META_FIELDS.reduce((arr, field) => {
		switch (field) {
			case '_id':
				arr.push(field);
				break;
			case '_index':
				if (this.props.shouldRenderIndexColumn) {
					arr.push(field);
				}
				break;
			default:
				break;
		}
		return arr;
	}, []);

	state = {
		data: this.props.data,
		showModal: false,
		visibleColumns: [
			...this.metaFields,
			...extractColumns(this.props.mappings),
		],
		showDropdown: false,
	};

	componentDidMount() {
		document.addEventListener(
			'mousedown',
			this.handleDropdownOutsideClick,
			false,
		);
	}

	componentWillUnmount() {
		document.removeEventListener(
			'mousedown',
			this.handleDropdownOutsideClick,
			false,
		);
	}

	setDropdownRef = node => {
		this.showHideDropdownNode = node;
	};

	handleDropdownOutsideClick = e => {
		if (
			this.showHideDropdownNode &&
			this.showHideDropdownNode.contains(e.target)
		) {
			return;
		}

		this.closeDropDown();
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
		setCellValue(record._id, column, value, record._index, record._type);
	};

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	};

	handleSelectAll = e => {
		const { mappings } = this.props;
		const { checked } = e.target;
		let visibleColumns;
		if (checked) {
			visibleColumns = [...META_FIELDS, ...extractColumns(mappings)];
		} else {
			visibleColumns = [];
		}
		this.setState({ visibleColumns });
	};

	handleVisibleColumnsChange = visibleColumns => {
		this.setState({ visibleColumns }); // this would need an order since ant doesn't maintain it
	};

	toggleDropDown = () => {
		this.setState(prevState => ({
			showDropdown: !prevState.showDropdown,
		}));
	};

	closeDropDown = () => {
		this.setState({
			showDropdown: false,
		});
	};

	render() {
		const {
			activeCell,
			mappings,
			setCellActive: setCellActiveDispatch,
			error,
		} = this.props;
		const { data, showModal, visibleColumns, showDropdown } = this.state;
		const { addDataIsLoading, addDataRequestError } = this.props;
		// current visible mappings are in state
		const columns = visibleColumns.map(property => {
			const isMetaField = META_FIELDS.indexOf(property) > -1;
			return {
				key: property,
				dataIndex: property,
				title: property,
				filterDropdown: !isMetaField && (
					<MappingsDropdown mapping={mappings.properties[property]} />
				),
				fixed: isMetaField,
				filterIcon: !isMetaField && (
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
				render: (text, record, row) => {
					if (isMetaField) {
						return (
							<div
								css={{
									minWidth: '230px',
									maxWidth: '250px',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									padding: 10,
								}}
							>
								{text}
							</div>
						);
					}
					return (
						<Cell
							row={row}
							column={property}
							active={
								activeCell.row === row &&
								activeCell.column === property
							}
							onFocus={setCellActiveDispatch}
							onChange={this.handleChange}
							mapping={mappings.properties[property]}
						>
							{text}
						</Cell>
					);
				},
			};
		});
		const columnsWithId = [...columns];
		const allColumns = [...META_FIELDS, ...extractColumns(mappings)];

		return (
			<Fragment>
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
							ref={this.setDropdownRef}
						>
							<Checkbox
								checked={
									visibleColumns.length === allColumns.length
								}
								indeterminate={
									visibleColumns.length < allColumns.length &&
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
								options={[
									...META_FIELDS,
									...extractColumns(mappings),
								]}
								css={{ display: 'grid', gridGap: 5 }}
								value={visibleColumns}
								onChange={this.handleVisibleColumnsChange}
							/>
						</div>
					}
					visible={showDropdown}
					trigger={['click']}
					onClick={this.toggleDropDown}
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
				<AddRowModal
					showModal={showModal}
					toggleModal={this.toggleModal}
				/>
			</Fragment>
		);
	}
}

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
	activeCell: shape({ row: number, column: string }),
	setCellActive: func.isRequired,
	setCellValue: func.isRequired,
	error: string,
	addDataRequestError: string,
	addDataIsLoading: bool.isRequired,
	shouldRenderIndexColumn: bool.isRequired,
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
