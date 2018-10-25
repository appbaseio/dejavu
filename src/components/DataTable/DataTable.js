import React, { Component } from 'react';
import { arrayOf, object, shape, string, number, func } from 'prop-types';
import { connect } from 'react-redux';

import MappingsDropdown from '../MappingsDropdown';
import Cell from '../Cell';
import StyledCell from './Cell.style';
import StyledRow from './Row.style';
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

const isMetaField = field => META_FIELDS.indexOf(field) > -1;

// making DataTable stateful to update data from cell since onAllData is invoked only when data changes due to query
class DataTable extends Component {
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
				<table style={{ overflow: 'auto' }}>
					<thead>
						<StyledRow isHeader>
							{visibleColumns.map(col => (
								<StyledCell key={col} isHeader>
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
						</StyledRow>
					</thead>
					<tbody>
						{data.map((dataItem, row) => (
							<StyledRow key={dataItem._id}>
								{visibleColumns.map(col => (
									<StyledCell key={`${dataItem._id}-${col}`}>
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
							</StyledRow>
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
