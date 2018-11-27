// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import difference from 'lodash/difference';

import {
	setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
	setCurrentIds,
	setArrayFields,
} from '../../actions';
import { getUrl, getAppname } from '../../reducers/app';
import {
	getVisibleColumns,
	getNestedVisibleColumns,
	getNestedColumns,
} from '../../reducers/mappings';
import { META_FIELDS, getNestedArrayField } from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import { isEqualArray, isEmptyObject } from '../../utils';

import Cell from '../Cell';
import StyledCell from './StyledCell';
import IdField from './IdField';
import idFieldStyles from '../CommonStyles/idField';

const isMetaField = field => META_FIELDS.indexOf(field) > -1;

type State = {
	data: any[],
};

type Props = {
	data: any[],
	mappings: any,
	setCellValue: (string, string, any, string, string) => void,
	visibleColumns: string[],
	nestedVisibleColumns: string[],
	mode: string,
	pageSize: number,
	onSetCurrentIds: any => void,
	isShowingNestedColumns: boolean,
	nestedColumns: string[],
	appName: string,
	onSetArrayFields: (string[], string[], any, string) => void,
};
class DataTable extends Component<Props, State> {
	state = {
		data: this.props.data,
	};

	componentDidMount() {
		this.props.onSetCurrentIds(this.props.data.map(item => item._id));
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqualArray(this.state.data, nextState.data) ||
			this.props.mode !== nextProps.mode ||
			this.props.pageSize !== nextProps.pageSize ||
			this.props.visibleColumns.length !==
				nextProps.visibleColumns.length ||
			this.props.isShowingNestedColumns !==
				nextProps.isShowingNestedColumns ||
			this.props.nestedVisibleColumns.length !==
				nextProps.nestedVisibleColumns.length
		);
	}

	componentDidUpdate(prevProps) {
		const {
			isShowingNestedColumns,
			mappings,
			nestedColumns,
			nestedVisibleColumns,
			data,
			appName,
			onSetArrayFields,
		} = this.props;
		if (
			prevProps.isShowingNestedColumns !== isShowingNestedColumns &&
			isShowingNestedColumns
		) {
			const { fieldsToBeDeleted, parentFields } = getNestedArrayField(
				data,
				mappings.nestedProperties,
			);

			if (
				!isEmptyObject(parentFields) &&
				difference(
					Object.keys(parentFields),
					Object.keys(mappings.nestedProperties),
				).length > 0
			) {
				const diffAllFields = difference(
					nestedColumns,
					Object.keys(fieldsToBeDeleted),
				);

				const diffVisibleFields = difference(
					nestedVisibleColumns,
					Object.keys(fieldsToBeDeleted),
				);

				const parentFieldsMapping = {};
				Object.keys(parentFields).forEach(key => {
					parentFieldsMapping[key] = get(
						mappings.properties,
						key.split('.').join('.properties.'),
					);
				});

				onSetArrayFields(
					[...diffAllFields, ...Object.keys(parentFields)],
					[...diffVisibleFields, ...Object.keys(parentFields)],
					parentFieldsMapping,
					appName,
				);
			}
		}
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
		const {
			visibleColumns,
			mode,
			mappings,
			pageSize,
			nestedVisibleColumns,
			isShowingNestedColumns,
		} = this.props;
		const { data } = this.state;
		const mappingCols = isShowingNestedColumns
			? nestedVisibleColumns
			: visibleColumns;

		const columns = ['_id', ...mappingCols];
		const mapProp = isShowingNestedColumns
			? 'nestedProperties'
			: 'properties';

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
									className={col === '_id' && idFieldStyles}
								>
									<StyledCell mode={mode}>
										{col === '_id' ? (
											<IdField
												rowIndex={rowIndex}
												data={data}
												pageSize={pageSize}
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
															this.handleChange(
																rowIndex,
																col,
																value,
															)
														}
														mapping={
															mappings[mapProp][
																col
															]
														}
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
	nestedVisibleColumns: getNestedVisibleColumns(state),
	nestedColumns: getNestedColumns(state),
	appName: getAppname(state),
});

const mapDispatchToProps = {
	setCellValue: setCellValueRequest,
	addDataRequest,
	setError,
	clearError,
	updateReactiveList,
	onSetCurrentIds: setCurrentIds,
	onSetArrayFields: setArrayFields,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
