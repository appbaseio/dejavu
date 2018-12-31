// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import difference from 'lodash/difference';

import ColumnRenderer from './ColumnRenderer';

import {
	setCellValueRequest,
	setCurrentIds,
	setArrayFields,
} from '../../actions';
import { getAppname } from '../../reducers/app';
import {
	getVisibleColumns,
	getNestedVisibleColumns,
	getNestedColumns,
	getTypePropertyMapping,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';
import {
	getNestedArrayField,
	updateIndexTypeMapping,
} from '../../utils/mappings';
import { getMode } from '../../reducers/mode';
import { getPageSize } from '../../reducers/pageSize';
import { isEqualArray, isEmptyObject } from '../../utils';

type State = {
	data: any[],
};

type Props = {
	data: any[],
	mappings: any,
	setCellValue: (string, string, any, string, string) => void,
	nestedVisibleColumns: string[],
	onSetCurrentIds: any => void,
	isShowingNestedColumns: boolean,
	nestedColumns: string[],
	appName: string,
	onSetArrayFields: (string[], string[], any, string, any) => void,
	typePropertyMapping: any,
	visibleColumns: string[],
	mode: string,
	pageSize: number,
};

const LAZY_CHUNK = 3;
class DataTable extends Component<Props, State> {
	isMounted = false;

	state = {
		data: this.props.data.slice(0, LAZY_CHUNK),
	};

	componentDidMount() {
		this.isMounted = true;
		this.props.onSetCurrentIds(this.props.data.map(item => item._id));
		this.lazyLoad();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqualArray(this.state.data, nextState.data) ||
			!isEqualArray(this.props.data, nextProps.data) ||
			this.props.visibleColumns.length !==
				nextProps.visibleColumns.length ||
			this.props.isShowingNestedColumns !==
				nextProps.isShowingNestedColumns ||
			this.props.nestedVisibleColumns.length !==
				nextProps.nestedVisibleColumns.length ||
			this.props.mode !== nextProps.mode ||
			this.props.pageSize !== nextProps.pageSize
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
			typePropertyMapping,
		} = this.props;
		if (
			prevProps.isShowingNestedColumns !== isShowingNestedColumns &&
			isShowingNestedColumns
		) {
			const {
				fieldsToBeDeleted,
				parentFields,
				indexTypeMap,
			} = getNestedArrayField(data, mappings.nestedProperties);

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

				const newTypePropertyMapping = updateIndexTypeMapping(
					typePropertyMapping,
					indexTypeMap,
					Object.keys(fieldsToBeDeleted),
					mappings,
				);

				onSetArrayFields(
					[...diffAllFields, ...Object.keys(parentFields)],
					[...diffVisibleFields, ...Object.keys(parentFields)],
					parentFieldsMapping,
					appName,
					newTypePropertyMapping,
				);
			}
		}

		this.lazyLoad();
	}

	componentWillUnmount() {
		this.isMounted = false;
	}

	handleCellChange = (row, column, value) => {
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

	lazyLoad = () => {
		setTimeout(() => {
			const hasMore =
				this.state.data.length + LAZY_CHUNK < this.props.data.length;

			if (this.isMounted) {
				this.setState(prevState => ({
					data: this.props.data.slice(
						0,
						prevState.data.length + LAZY_CHUNK,
					),
				}));
			}

			if (hasMore) this.lazyLoad();
		}, 0);
	};

	render() {
		const { data } = this.state;
		const {
			mappings,
			visibleColumns,
			mode,
			nestedVisibleColumns,
			isShowingNestedColumns,
		} = this.props;

		return (
			<table
				css={{
					overflowY: 'auto',
				}}
			>
				<tbody>
					{data.map((dataItem, rowIndex) => (
						<tr key={dataItem._id}>
							<ColumnRenderer
								rowIndex={rowIndex}
								dataItem={dataItem}
								data={data}
								mappings={mappings}
								onCellChange={this.handleCellChange}
								visibleColumns={visibleColumns}
								mode={mode}
								nestedVisibleColumns={nestedVisibleColumns}
								isShowingNestedColumns={isShowingNestedColumns}
							/>
						</tr>
					))}
				</tbody>
			</table>
		);
	}
}

const mapStateToProps = state => ({
	nestedVisibleColumns: getNestedVisibleColumns(state),
	nestedColumns: getNestedColumns(state),
	appName: getAppname(state),
	typePropertyMapping: getTypePropertyMapping(state),
	isShowingNestedColumns: getIsShowingNestedColumns(state),
	visibleColumns: getVisibleColumns(state),
	mode: getMode(state),
	pageSize: getPageSize(state),
});

const mapDispatchToProps = {
	setCellValue: setCellValueRequest,
	onSetCurrentIds: setCurrentIds,
	onSetArrayFields: setArrayFields,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataTable);
