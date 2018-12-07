// @flow

import React, { Component, Fragment } from 'react';
import get from 'lodash/get';

import Cell from '../Cell';
import StyledCell from './StyledCell';
import IdField from './IdField';
import idFieldStyles from '../CommonStyles/idField';

import { META_FIELDS } from '../../utils/mappings';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;

const getMappingColumns = props => {
	const {
		isShowingNestedColumns,
		nestedVisibleColumns,
		visibleColumns,
	} = props;
	const mappingCols = isShowingNestedColumns
		? nestedVisibleColumns
		: visibleColumns;
	return ['_id', ...mappingCols];
};

type State = {
	columns: string[],
};

type Props = {
	// eslint-disable-next-line
	visibleColumns: string[],
	mode: string,
	mappings: any,
	// eslint-disable-next-line
	nestedVisibleColumns: string[],
	isShowingNestedColumns: boolean,
	data: any,
	dataItem: any,
	rowIndex: number,
	onCellChange: (...any) => void,
};

class ColumnRenderer extends Component<Props, State> {
	state = {
		columns: getMappingColumns(this.props).slice(0, 4),
	};

	componentDidMount() {
		this.lazyLoad();
	}

	componentDidUpdate(nextProps: any) {
		if (
			nextProps.isShowingNestedColumns !==
				this.props.isShowingNestedColumns ||
			nextProps.visibleColumns.length !==
				this.props.visibleColumns.length ||
			nextProps.nestedVisibleColumns.length !==
				this.props.nestedVisibleColumns.length
		) {
			this.lazyLoad();
		}
	}

	lazyLoad = () => {
		setTimeout(() => {
			const hasMore =
				this.state.columns.length + 4 <
				getMappingColumns(this.props).length;

			this.setState(prevState => ({
				columns: getMappingColumns(this.props).slice(
					0,
					prevState.columns.length + 4,
				),
			}));

			if (hasMore) this.lazyLoad();
		}, 0);
	};

	render() {
		const {
			mode,
			mappings,
			isShowingNestedColumns,
			data,
			dataItem,
			rowIndex,
			onCellChange,
		} = this.props;
		const { columns } = this.state;

		const mapProp = isShowingNestedColumns
			? 'nestedProperties'
			: 'properties';

		return (
			<Fragment>
				{columns.map(col => (
					<td
						key={`${dataItem._id}-${col}`}
						css={{
							minWidth: 200,
							maxWidth: 200,
						}}
						className={col === '_id' && idFieldStyles}
					>
						<StyledCell mode={mode}>
							{col === '_id' ? (
								<IdField
									rowIndex={rowIndex}
									data={data}
									value={dataItem._id}
								/>
							) : (
								<div css={{ width: '100%' }}>
									{isMetaField(col) ? (
										<div>{dataItem[col]}</div>
									) : (
										<Cell
											row={rowIndex}
											column={col}
											mode={mode}
											onChange={value =>
												onCellChange(
													rowIndex,
													col,
													value,
												)
											}
											mapping={mappings[mapProp][col]}
											shouldAutoFocus
										>
											{get(dataItem, col)}
										</Cell>
									)}
								</div>
							)}
						</StyledCell>
					</td>
				))}
			</Fragment>
		);
	}
}

export default ColumnRenderer;
