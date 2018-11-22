// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';

import {
	setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
} from '../../actions';
import { getUrl } from '../../reducers/app';
import { getVisibleColumns } from '../../reducers/mappings';
import { META_FIELDS } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';
import { isEqualArray } from '../../utils';

import Cell from '../Cell';
import StyledCell from './StyledCell';
import IdField from './IdField';

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
	mode: string,
	pageSize: number,
};
class DataTable extends Component<Props, State> {
	state = {
		data: this.props.data,
	};

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqualArray(this.state.data, nextState.data) ||
			this.props.mode !== nextProps.mode ||
			this.props.pageSize !== nextProps.pageSize ||
			this.props.visibleColumns.length !== nextProps.visibleColumns.length
		);
	}

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

	render() {
		const { visibleColumns, mode, mappings, pageSize } = this.props;
		const { data } = this.state;
		const columns = ['_id', ...visibleColumns];
		console.log('re-rendering');

		return (
			<table
				css={{
					overflowY: 'auto',
				}}
			>
				<tbody>
					{data.map((dataItem, rowIndex) => (
						<tr key={dataItem._id}>
							{columns.map(col => (
								<td
									key={`${dataItem._id}-${col}`}
									css={{
										minWidth: 200,
										maxWidth: 200,
									}}
									className={
										col === '_id' &&
										css({
											zIndex: '101 !important',
											left: 0,
											background: colors.tableHead,
											position: 'sticky',
										})
									}
								>
									<StyledCell>
										{col === '_id' ? (
											<IdField
												rowIndex={rowIndex}
												data={data}
												pageSize={pageSize}
												value={dataItem._id}
											/>
										) : (
											<div>
												{isMetaField(col) ? (
													<div>{dataItem[col]}</div>
												) : (
													<Cell
														row={rowIndex}
														column={col}
														mode={mode}
														onChange={value =>
															this.handleChange(
																rowIndex,
																col,
																value,
															)
														}
														mapping={
															mappings.properties[
																col
															]
														}
														shouldAutoFocus
													>
														{dataItem[col]}
													</Cell>
												)}
											</div>
										)}
									</StyledCell>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	}
}

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
