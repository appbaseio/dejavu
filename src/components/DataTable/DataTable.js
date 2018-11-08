// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, object, string, func, number } from 'prop-types';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import MultiGrid from 'react-virtualized/dist/commonjs/MultiGrid';
import { Icon, Popover } from 'antd';

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
import StyledCell from './StyledCell';
import JsonView from '../JsonView';
import overflowText from './overflow.style';
// import { addData, deleteData } from '../../apis';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;
const srotableTypes = getSortableTypes();

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
	// appUrl: string,
	// setError: func,
	// clearError: func,
	// updateReactiveList: func,
	onLoadMore: () => void,
	scrollToColumn: number,
	sortField: string,
	sort: string,
};
class DataTable extends Component<Props, State> {
	gridRef = null;

	state = {
		data: this.props.data,
	};

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
		let col = '';
		if (columnIndex > 0) {
			col = visibleColumns[columnIndex - 1];
		} else {
			col = '_id';
		}

		if (columnIndex === 0 && rowIndex === 0) {
			return (
				<StyledCell style={style} key={key} tabIndex="0">
					_id
				</StyledCell>
			);
		}

		if (rowIndex === 0 && columnIndex > 0) {
			return (
				<StyledCell style={style} key={key} tabIndex="0">
					<Flex
						justifyContent="space-between"
						alignItems="center"
						css={{
							width: '100%',
						}}
					>
						<Flex alignItems="center">
							{mappings.properties[col] && (
								<MappingsDropdown
									mapping={mappings.properties[col]}
								/>
							)}
							<span css={{ marginLeft: '10px' }}>{col}</span>
						</Flex>
						{mappings.properties[col] &&
							mappings.properties[col].type &&
							srotableTypes.indexOf(
								mappings.properties[col].type,
							) > -1 && (
								<button
									type="button"
									onClick={() => {
										this.handleSort(col, columnIndex);
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
									{sortField.indexOf(col) === -1 && (
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
									{sortField.indexOf(col) > -1 && (
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
				</StyledCell>
			);
		}
		return (
			<StyledCell key={key} style={style} tabIndex="0">
				{columnIndex === 0 && (
					<StyledCell css={{ borderRight: 0 }}>
						<Popover
							content={
								<div
									css={{
										maxWidth: '400px',
										maxHeight: '300px',
										overflow: 'auto',
									}}
								>
									<JsonView json={data[rowIndex]} />
								</div>
							}
							trigger="click"
						>
							<span
								css={{ cursor: 'pointer', marginRight: '10px' }}
							>{` {...} `}</span>
						</Popover>
						<div css={overflowText}>{data[rowIndex]._id}</div>
					</StyledCell>
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
