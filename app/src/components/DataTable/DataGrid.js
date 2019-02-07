// @flow

import React, { Component, createRef } from 'react';
import get from 'lodash/get';
import { Scrollbars } from 'react-custom-scrollbars';
import { Grid, ScrollSync } from 'react-virtualized';
import isMobile from 'ismobilejs';

import CellRender from '../Cell';
import StyledCell from './StyledCell';
import IdField from './IdField';
import Flex from '../Flex';

import { META_FIELDS } from '../../utils/mappings';
import { MODES } from '../../constants';
import colors from '../theme/colors';
import { isEqualArray } from '../../utils';

const OVERSCAN_COUNT = 3;
const HEIGHT_BUFFER = 32;
const CELL_STYLE = {
	borderRight: '0.5px solid #e8e8e8',
	borderBottom: '1px solid #e8e8e8',
	fontSize: '12px',
	padding: '10px',
};

const ID_WIDTH = isMobile.any ? 120 : 250;

const isMetaField = field => META_FIELDS.indexOf(field) > -1;

type Props = {
	visibleColumns: string[],
	mode: string,
	mappings: any,
	nestedVisibleColumns: string[],
	isShowingNestedColumns: boolean,
	data: any,
	onCellChange: (...any) => void,
	height: number,
	width: number,
	headerRef: any,
};

type State = {
	updateKey: number,
};
class DataGrid extends Component<Props, State> {
	dataGridRef: any = createRef();

	dataScrollRef: any = createRef();

	state = {
		updateKey: Date.now(),
	};

	componentDidMount() {
		this.handleScrollLeft();
	}

	componentDidUpdate(prevProps: any) {
		this.handleScrollLeft();

		if (!isEqualArray(prevProps.data, this.props.data)) {
			this.setUpdateKey();
		}
	}

	setUpdateKey = () => {
		this.setState(prevState => ({
			updateKey: prevState.updateKey + 1,
		}));
	};

	handleScrollLeft = () => {
		const { headerRef } = this.props;
		if (
			headerRef &&
			headerRef.current &&
			headerRef.current.scrollLeft > 0
		) {
			this.dataScrollRef.current.scrollLeft(headerRef.current.scrollLeft);
		}
	};

	handleScroll = ({ target }: any) => {
		const { scrollTop, scrollLeft } = target;
		const { headerRef } = this.props;

		if (headerRef && headerRef.current) {
			headerRef.current.scrollLeft = scrollLeft;
		}
		// $FlowFixMe
		this.dataGridRef.current.handleScrollEvent({
			scrollTop,
			scrollLeft,
		});
	};

	_renderLeftSideCell = ({ key, rowIndex, style }: any) => {
		const { data, mode } = this.props;

		return (
			<StyledCell
				style={style}
				mode={mode}
				key={key}
				css={{ width: '100%', background: colors.tableHead }}
			>
				<IdField
					rowIndex={rowIndex}
					data={data}
					value={data[rowIndex]._id}
				/>
			</StyledCell>
		);
	};

	_renderDataCell = ({ columnIndex, key, rowIndex, style }: any) => {
		const {
			nestedVisibleColumns,
			visibleColumns,
			isShowingNestedColumns,
			onCellChange,
			mappings,
			data,
			mode,
		} = this.props;
		const columns = isShowingNestedColumns
			? nestedVisibleColumns
			: visibleColumns;
		const mapProp = isShowingNestedColumns
			? 'nestedProperties'
			: 'properties';
		const column = columns[columnIndex];
		return isMetaField(column) ? (
			<div
				style={{
					...style,
					...CELL_STYLE,
				}}
				key={key}
			>
				{get(data[rowIndex], column)}
			</div>
		) : (
			<div
				style={{
					...style,
					...CELL_STYLE,
				}}
				key={key}
			>
				<CellRender
					row={rowIndex}
					column={column}
					mode={mode}
					onChange={value => onCellChange(rowIndex, column, value)}
					mapping={mappings[mapProp][column]}
					shouldAutoFocus
					style={style}
				>
					{get(data[rowIndex], column)}
				</CellRender>
			</div>
		);
	};

	render() {
		const {
			mode,
			data,
			height,
			width,
			isShowingNestedColumns,
			nestedVisibleColumns,
			visibleColumns,
		} = this.props;
		const { updateKey } = this.state;
		const columns = isShowingNestedColumns
			? nestedVisibleColumns
			: visibleColumns;

		return (
			<div key={updateKey}>
				<ScrollSync>
					{({ onScroll, scrollTop }) => (
						<Flex wrap="nowrap">
							<Grid
								overscanColumnCount={0}
								overscanRowCount={OVERSCAN_COUNT}
								cellRenderer={this._renderLeftSideCell}
								columnWidth={ID_WIDTH}
								columnCount={1}
								height={height - HEIGHT_BUFFER}
								rowHeight={mode === MODES.EDIT ? 45 : 30}
								css={{
									zIndex: '101 !important',
									left: 0,
									position: 'absolute',
									backgroundColor: colors.tableHead,
									outline: 0,
									overflow: 'hidden !important',
								}}
								rowCount={data.length}
								scrollTop={scrollTop}
								width={ID_WIDTH}
							/>
							<Scrollbars
								ref={this.dataScrollRef}
								onScroll={this.handleScroll}
								style={{
									height: height - HEIGHT_BUFFER,
									width: width - ID_WIDTH,
								}}
							>
								<Grid
									overscanColumnCount={OVERSCAN_COUNT}
									overscanRowCount={OVERSCAN_COUNT}
									cellRenderer={this._renderDataCell}
									columnWidth={200}
									columnCount={columns.length}
									height={height - HEIGHT_BUFFER}
									rowHeight={mode === MODES.EDIT ? 45 : 30}
									rowCount={data.length}
									onScroll={onScroll}
									width={width - ID_WIDTH}
									style={{
										outline: 0,
										overflowX: false,
										overflowY: false,
									}}
									ref={this.dataGridRef}
								/>
							</Scrollbars>
						</Flex>
					)}
				</ScrollSync>
			</div>
		);
	}
}

export default DataGrid;
