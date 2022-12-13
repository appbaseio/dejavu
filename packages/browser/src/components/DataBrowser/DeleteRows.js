// @flow

import React, { Component } from 'react';
import { Popconfirm, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { getUrl } from '../../reducers/app';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getIndexes, getTypes } from '../../reducers/mappings';
import { getApplyQuery } from '../../reducers/applyQuery';
import { getQuery } from '../../reducers/query';
import { getVersion } from '../../reducers/version';
import {
	setError,
	clearError,
	updateReactiveList,
	setSelectedRows,
	setSelectAll,
	setApplyQuery,
} from '../../actions';
import { deleteData } from '../../apis/data';

type Props = {
	selectedRows: string[],
	appUrl: string,
	indexes: string[],
	types: string[],
	version: number,
	setError: any => void,
	clearError: () => void,
	updateReactiveList: () => void,
	setSelectedRows: any => void,
	applyQuery: boolean,
	query: any,
	onSetApplyQuery: boolean => void,
	onSetSelectAll: boolean => void,
};

class DeleteRows extends Component<Props> {
	handleConfirm = async () => {
		const {
			appUrl,
			indexes,
			types,
			selectedRows,
			setError: onSetError,
			clearError: onClearError,
			updateReactiveList: onUpdateReactiveList,
			setSelectedRows: onSetSelectedRows,
			onSetApplyQuery,
			onSetSelectAll,
			applyQuery,
			query,
			version,
		} = this.props;
		const queryData = applyQuery ? query.query : selectedRows;
		try {
			onClearError();
			await deleteData(
				appUrl,
				indexes.join(','),
				types.join(','),
				queryData,
				version,
			);
			setTimeout(() => {
				onSetSelectedRows([]);
				onSetSelectAll(false);
				onSetApplyQuery(false);
				onUpdateReactiveList();
			}, 100);
		} catch (error) {
			onSetError(error);
		}
	};

	render() {
		return (
			<Popconfirm
				placement="topLeft"
				title="Are you sure to delete this data?"
				onConfirm={this.handleConfirm}
				okText="Yes"
				cancelText="No"
			>
				<Button
					css={{ marginRight: '5px' }}
					danger
					icon={<DeleteOutlined />}
				>
					Delete
				</Button>
			</Popconfirm>
		);
	}
}

const mpaStateToProps = state => ({
	appUrl: getUrl(state),
	selectedRows: getSelectedRows(state),
	indexes: getIndexes(state),
	types: getTypes(state),
	applyQuery: getApplyQuery(state),
	query: getQuery(state),
	version: getVersion(state),
});

const mapDispatchToProps = {
	setError,
	clearError,
	updateReactiveList,
	setSelectedRows,
	onSetApplyQuery: setApplyQuery,
	onSetSelectAll: setSelectAll,
};
export default connect(mpaStateToProps, mapDispatchToProps)(DeleteRows);
