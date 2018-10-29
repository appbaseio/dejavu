// @flow

import React, { Component } from 'react';
import { arrayOf, object, shape, string, number, func } from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'react-emotion';

import MappingsDropdown from '../MappingsDropdown';
import Cell from '../Cell';
import StyledCell from './Cell.style';
import Flex from '../Flex';

import { getActiveCell } from '../../reducers/cell';
import {
	setCellActive,
	setCellValueRequest,
	addDataRequest,
} from '../../actions';
import { getVisibleColumns } from '../../reducers/mappings';
import { META_FIELDS } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import colors from '../theme/colors';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;

// making DataTable stateful to update data from cell since onAllData is invoked only when data changes due to query
type Props = {
	data: object[],
	mappings: object,
	activeCell: { row: number, column: string },
	setCellActive: (number, string) => void,
	setCellValue: (string, string, any, string, string) => void,
	visibleColumns: string[],
	mode: string,
};

type State = {
	data: object[],
};
class DataTable extends Component<Props, State> {
	state = {
		data: this.props.data,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.data.length !== this.props.data.length) {
			this.updateData(this.props.data);
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

	render() {
		const {
			activeCell,
			mappings,
			setCellActive: setCellActiveDispatch,
			visibleColumns,
			mode,
		} = this.props;

		const { data } = this.state;

		return (
			<div>
				<table
					css={{
						overflow: 'auto',
						borderRadius: '4px',
					}}
				>
					<thead>
						<tr>
							{visibleColumns.map(col => (
								<StyledCell
									key={col}
									isHeader
									className={
										col === '_id' &&
										css({
											zIndex: '101 !important',
										})
									}
									isFixed={col === '_id'}
								>
									<Flex
										justifyContent="space-between"
										alignItems="center"
									>
										{col}
										{mappings.properties[col] && (
											<MappingsDropdown
												mapping={
													mappings.properties[col]
												}
											/>
										)}
									</Flex>
								</StyledCell>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((dataItem, row) => (
							<tr key={dataItem._id}>
								{visibleColumns.map(col => (
									<StyledCell
										key={`${dataItem._id}-${col}`}
										className={
											col === '_id' &&
											css({
												zIndex: 3,
												background: colors.white,
											})
										}
										isFixed={col === '_id'}
									>
										{isMetaField(col) ? (
											dataItem[col]
										) : (
											<Cell
												row={row}
												column={col}
												mode={mode}
												active={
													mode === 'edit' &&
													activeCell.row === row &&
													activeCell.column === col
												}
												onClick={setCellActiveDispatch}
												onChange={this.handleChange}
												mapping={
													mappings.properties[col]
												}
											>
												{dataItem[col]}
											</Cell>
										)}
									</StyledCell>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

DataTable.propTypes = {
	data: arrayOf(object).isRequired,
	mappings: object.isRequired,
	activeCell: shape({ row: number, column: string }),
	setCellActive: func.isRequired,
	setCellValue: func.isRequired,
	visibleColumns: arrayOf(string).isRequired,
	mode: string,
};

const mapStateToProps = state => ({
	activeCell: getActiveCell(state),
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
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
