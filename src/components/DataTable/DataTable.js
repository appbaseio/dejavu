// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, object, string, func, number } from 'prop-types';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import { Popover, Checkbox } from 'antd';

import 'react-virtualized/styles.css';

import {
	setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
	setSelectedRows,
	setUpdatingRow,
} from '../../actions';
import { getUrl } from '../../reducers/app';
import { getVisibleColumns } from '../../reducers/mappings';
import { getSelectedRows } from '../../reducers/selectedRows';
import { META_FIELDS } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';
import { MODES } from '../../constants';
import { getOnlySource } from '../../utils';

import Cell from '../Cell';
import Flex from '../Flex';
import StyledCell from './StyledCell';
import JsonView from '../JsonView';
import overflowText from './overflow.style';
import popoverContent from '../CommonStyles/popoverContent';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;
// const srotableTypes = getSortableTypes();

type State = {
	data: any[],
};

type Props = {
	data: any[],
	mappings: any,
	setCellValue: (string, string, any, string, string) => void,
	visibleColumns: string[],
	handleSortChange: (string, number) => void,
	mode: string,
	onLoadMore: () => void,
	scrollToColumn: number,
	selectedRows: string[],
	setSelectedRows: (string[]) => void,
	setUpdatingRow: any => void,
	onScroll: any => void,
};
class DataTable extends Component<Props, State> {
	gridRef = null;

	state = {
		data: this.props.data,
	};

	horizontalScroll = 0;

	componentDidUpdate(prevProps) {
		if (prevProps.data.length !== this.props.data.length) {
			this.updateData(this.props.data);
		}

		if (prevProps.mode !== this.props.mode) {
			// $FlowFixMe
			this.gridRef.recomputeGridSize();
		}
	}

	updateData = data => {
		this.setState({
			data,
		});
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

	handleSort = (col, colIndex) => {
		const { mappings, handleSortChange } = this.props;
		let column = col;
		const { horizontalScroll } = this;

		if (mappings.properties[col] && mappings.properties[col].type) {
			switch (mappings.properties[col].type) {
				case 'text':
					column = `${col}.keyword`;
					break;
				default:
					column = col;
			}
		}

		setTimeout(() => {
			const elements = document.getElementsByClassName(
				'ReactVirtualized__Grid',
			);

			if (elements && elements[3]) {
				elements[3].scrollLeft = horizontalScroll;
			}
		}, 1500);

		handleSortChange(column, colIndex);
	};

	setRef = node => {
		this.gridRef = node;
	};

	handleScroll = ({ scrollTop, clientHeight, scrollHeight, scrollLeft }) => {
		if (
			clientHeight &&
			scrollHeight &&
			clientHeight + scrollTop >= scrollHeight - 30
		) {
			this.props.onLoadMore();
		}

		this.props.onScroll();

		this.horizontalScroll = scrollLeft;
	};

	handleRowSelectChange = e => {
		const {
			target: { checked, value },
		} = e;
		const currentSelectedRows = [...this.props.selectedRows];
		const currentValueIndex = currentSelectedRows.indexOf(value);
		let newSelectedRows = [];
		if (checked && currentValueIndex === -1) {
			newSelectedRows = [...currentSelectedRows, value];
		} else {
			newSelectedRows = [
				...currentSelectedRows.slice(0, currentValueIndex),
				...currentSelectedRows.slice(currentValueIndex + 1),
			];
		}

		if (newSelectedRows.length === 1) {
			const data = this.state.data.find(
				item => item._id === newSelectedRows[0],
			);
			this.props.setUpdatingRow(data);
		} else {
			this.props.setUpdatingRow(null);
		}

		this.props.setSelectedRows(newSelectedRows);
	};

	handleSelectAllRows = e => {
		const {
			target: { checked },
		} = e;

		const {
			setSelectedRows: onSetSelectedRows,
			setUpdatingRow: onSetUpdatingRow,
		} = this.props;
		const { data } = this.state;

		if (checked) {
			onSetSelectedRows(data.map(item => item._id));
		} else {
			onSetSelectedRows([]);
		}
		onSetUpdatingRow(null);
	};

	cellRender = ({ columnIndex, key, rowIndex, style }) => {
		const { visibleColumns, mappings, mode, selectedRows } = this.props;
		const { data } = this.state;
		let col = '';
		if (columnIndex > 0) {
			col = visibleColumns[columnIndex - 1];
		} else {
			col = '_id';
		}
		return (
			<StyledCell key={key} style={style}>
				{columnIndex === 0 && (
					<Flex
						wrap="nowrap"
						css={{ width: '100%' }}
						alignItems="center"
					>
						<div
							css={{
								maxWidth: '15%',
								minWidth: '15%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								'.ant-checkbox-wrapper': {
									display:
										selectedRows.indexOf(
											data[rowIndex]._id,
										) > -1
											? 'block !important'
											: 'none',
								},
								'&:hover': {
									'.ant-checkbox-wrapper': {
										display:
											mode === MODES.EDIT
												? 'block !important'
												: 'none',
									},
									'.index-no': {
										display:
											mode === MODES.EDIT
												? 'none'
												: 'block',
									},
								},
							}}
						>
							<Checkbox
								onChange={this.handleRowSelectChange}
								value={data[rowIndex]._id}
								checked={
									selectedRows.indexOf(data[rowIndex]._id) >
									-1
								}
							/>

							{selectedRows.indexOf(data[rowIndex]._id) ===
								-1 && (
								<div
									className="index-no"
									css={{ marginRight: 5 }}
								>
									{rowIndex + 1}
								</div>
							)}
						</div>
						<Popover
							content={
								<div css={popoverContent}>
									<JsonView
										json={getOnlySource(data[rowIndex])}
									/>
								</div>
							}
							trigger="click"
						>
							<span
								css={{
									cursor: 'pointer',
									maxWidth: '10%',
									minWidth: '10%',
								}}
							>{` {...} `}</span>
						</Popover>
						<Popover
							content={
								<div css={popoverContent}>
									{data[rowIndex]._id}
								</div>
							}
							placement="topLeft"
							trigger="click"
						>
							<div
								css={{
									cursor: 'pointer',
									maxWidth: '75%',
									minWidth: '75%',
									marginLeft: '10px',
									...overflowText,
								}}
							>
								{data[rowIndex]._id}
							</div>
						</Popover>
					</Flex>
				)}

				{columnIndex > 0 &&
					(isMetaField(col) ? (
						<div>{data[rowIndex][col]}</div>
					) : (
						<Cell
							row={rowIndex}
							column={col}
							mode={mode}
							onChange={value =>
								this.handleChange(rowIndex, col, value)
							}
							mapping={mappings.properties[col]}
							shouldAutoFocus
						>
							{data[rowIndex][col]}
						</Cell>
					))}
			</StyledCell>
		);
	};

	render() {
		const { visibleColumns, mode, scrollToColumn } = this.props;
		const { data } = this.state;

		return (
			Boolean(data.length) && (
				<div
					css={{
						position: 'relative',
						'.TopRightGrid_ScrollWrapper .ReactVirtualized__Grid': {
							overflow: 'hidden !important',
						},
						'.BottomLeftGrid_ScrollWrapper .ReactVirtualized__Grid': {
							overflow: 'hidden !important',
						},
						border: `1px solid ${colors.tableBorderColor}`,
						borderRadius: '4px',
					}}
				>
					<AutoSizer disableHeight>
						{({ width }) => (
							<Grid
								ref={this.setRef}
								// fixedColumnCount={1}
								// isScrollingOptOut
								scrollToColumn={scrollToColumn}
								cellRenderer={this.cellRender}
								columnWidth={250}
								columnCount={visibleColumns.length + 1}
								enableFixedColumnScroll
								enableFixedRowScroll
								overscanRowCount={1}
								rowHeight={mode === MODES.EDIT ? 50 : 35}
								rowCount={data.length}
								tabIndex={null}
								height={window.innerHeight - 310}
								styleBottomLeftGrid={{
									borderRight: `2px solid ${
										colors.tableBorderColor
									}`,
									borderBottom: `1px solid ${
										colors.tableBorderColor
									}`,
									borderBottomLeftRadius: 4,
									backgroundColor: colors.tableHead,
								}}
								styleTopLeftGrid={{
									borderBottom: `2px solid ${
										colors.tableBorderColor
									}`,
									borderRight: `2px solid ${
										colors.tableBorderColor
									}`,
									fontWeight: 'bold',
								}}
								styleTopRightGrid={{
									borderBottom: `2px solid ${
										colors.tableBorderColor
									}`,
									fontWeight: 'bold',
								}}
								width={width}
								// hideTopRightGridScrollbar
								// hideBottomLeftGridScrollbar
								onScroll={this.handleScroll}
							/>
						)}
					</AutoSizer>
				</div>
			)
		);
	}
}

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
	setCellValue: func.isRequired,
	visibleColumns: arrayOf(string).isRequired,
	handleSortChange: func.isRequired,
	mode: string,
	// appUrl: string,
	// setError: func,
	// clearError: func,
	// updateReactiveList: func,
	onLoadMore: func,
	scrollToColumn: number,
	selectedRows: arrayOf(string),
	setUpdatingRow: func,
	setSelectedRows: func,
	onScroll: func,
};

const mapStateToProps = state => ({
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
	appUrl: getUrl(state),
	selectedRows: getSelectedRows(state),
});

const mapDispatchToProps = {
	setCellValue: setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
	setSelectedRows,
	setUpdatingRow,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
