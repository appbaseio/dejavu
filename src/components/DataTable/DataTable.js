import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, object, string, func, number } from 'prop-types';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import MultiGrid from 'react-virtualized/dist/commonjs/MultiGrid';
import { Icon } from 'antd';

import 'react-virtualized/styles.css';

import {
	setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
} from '../../actions';
import { getUrl } from '../../reducers/app';
import { getVisibleColumns } from '../../reducers/mappings';
import { META_FIELDS, getSortableTypes } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';
import { MODES } from '../../constants';

import Cell from '../Cell';
import Flex from '../Flex';
import MappingsDropdown from '../MappingsDropdown';
import SortIcon from '../../images/icons/sort.svg';
// import overflowText from './overflow.style';
// import { addData, deleteData } from '../../apis';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;
const srotableTypes = getSortableTypes();
class DataTable extends Component {
	gridRef = null;

	state = {
		data: this.props.data,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.data.length !== this.props.data.length) {
			this.updateData(this.props.data);
		}

		if (prevProps.mode !== this.props.mode) {
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

		if (
			mappings.properties[col] &&
			mappings.properties[col].type &&
			(mappings.properties[col].type === 'text' ||
				mappings.properties[col].type === 'string')
		) {
			column =
				mappings.properties[col].type === 'text'
					? `${col}.keyword`
					: `${col}.raw`;
		}

		handleSortChange(column, colIndex);
	};

	setRef = node => {
		this.gridRef = node;
	};

	handleScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
		if (
			clientHeight &&
			scrollHeight &&
			scrollHeight - scrollTop === clientHeight
		) {
			this.props.onLoadMore();
		}
	};

	cellRender = ({ columnIndex, key, rowIndex, style }) => {
		const { visibleColumns, mappings, mode, sortField, sort } = this.props;
		const { data } = this.state;

		if (columnIndex === 0 && rowIndex === 0) {
			return (
				<div
					style={style}
					css={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderBottom: '1px solid #eee',
						borderRight: '1px solid #eee',
					}}
				>
					_id
				</div>
			);
		}

		if (rowIndex === 0 && columnIndex > 0) {
			return (
				<div
					style={style}
					css={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderBottom: '1px solid #eee',
						borderRight: '1px solid #eee',
						fontSize: '13px',
					}}
				>
					<Flex
						justifyContent="space-between"
						alignItems="center"
						css={{
							width: '100%',
							padding: '10px',
						}}
					>
						<Flex alignItems="center">
							{mappings.properties[
								visibleColumns[columnIndex - 1]
							] && (
								<MappingsDropdown
									mapping={
										mappings.properties[
											visibleColumns[columnIndex - 1]
										]
									}
								/>
							)}
							<span css={{ marginLeft: '10px' }}>
								{visibleColumns[columnIndex - 1]}
							</span>
						</Flex>
						{mappings.properties[visibleColumns[columnIndex - 1]] &&
							mappings.properties[visibleColumns[columnIndex - 1]]
								.type &&
							srotableTypes.indexOf(
								mappings.properties[
									visibleColumns[columnIndex - 1]
								].type,
							) > -1 && (
								<button
									type="button"
									onClick={() => {
										this.handleSort(
											visibleColumns[columnIndex - 1],
											columnIndex,
										);
									}}
									css={{
										outline: 0,
										height: '15px',
										width: '15px',
										border: 0,
										cursor: 'pointer',
										background: 'none',
									}}
								>
									{sortField.indexOf(
										visibleColumns[columnIndex - 1],
									) === -1 && (
										<img
											src={SortIcon}
											alt="sort-icon"
											css={{
												height: '15px',
												marginTop: '-10px',
												marginLeft: '-5px',
											}}
										/>
									)}
									{sortField.indexOf(
										visibleColumns[columnIndex - 1],
									) > -1 && (
										<Icon
											type={
												sort === 'asc'
													? 'caret-down'
													: 'caret-up'
											}
										/>
									)}
								</button>
							)}
					</Flex>
				</div>
			);
		}
		return (
			<div
				css={{
					display: 'flex',
					alignItems: 'center',
					padding: '10px',
					borderBottom: '1px solid #eee',
					borderRight: '1px solid #eee',
					fontSize: '12px',
				}}
				key={key}
				style={style}
			>
				{columnIndex === 0 && data[rowIndex]._id}

				{columnIndex > 0 &&
					(isMetaField(visibleColumns[columnIndex - 1]) ? (
						<div>
							{data[rowIndex][visibleColumns[columnIndex - 1]]}
						</div>
					) : (
						<Cell
							row={rowIndex}
							column={visibleColumns[columnIndex - 1]}
							mode={mode}
							onChange={value =>
								this.handleChange(
									rowIndex,
									visibleColumns[columnIndex - 1],
									value,
								)
							}
							mapping={
								mappings.properties[
									visibleColumns[columnIndex - 1]
								]
							}
							shouldAutoFocus
						>
							{data[rowIndex][visibleColumns[columnIndex - 1]]}
						</Cell>
					))}
			</div>
		);
	};

	render() {
		const { visibleColumns, mode, scrollToColumn } = this.props;
		const { data } = this.state;

		return (
			<div
				css={{
					position: 'relative',
					'.TopRightGrid_ScrollWrapper .ReactVirtualized__Grid': {
						overflow: 'hidden !important',
					},
					'.BottomLeftGrid_ScrollWrapper .ReactVirtualized__Grid': {
						overflow: 'hidden !important',
					},
				}}
			>
				<AutoSizer disableHeight>
					{({ width }) => (
						<MultiGrid
							ref={this.setRef}
							fixedColumnCount={1}
							fixedRowCount={1}
							scrollToColumn={scrollToColumn}
							scrollToRow={0}
							cellRenderer={this.cellRender}
							columnWidth={250}
							columnCount={visibleColumns.length + 1}
							enableFixedColumnScroll
							enableFixedRowScroll
							height={500}
							rowHeight={mode === MODES.EDIT ? 50 : 30}
							rowCount={data.length}
							style={{
								border: `1px solid ${colors.tableBorderColor}`,
								borderRadius: '4px',
							}}
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
							hideTopRightGridScrollbar
							hideBottomLeftGridScrollbar
							onScroll={this.handleScroll}
						/>
					)}
				</AutoSizer>
			</div>
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
	sortField: string,
	sort: string,
};

const mapStateToProps = state => ({
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
	appUrl: getUrl(state),
});

const mapDispatchToProps = {
	setCellValue: setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
