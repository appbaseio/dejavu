// @flow

import React, { Component } from 'react';
import { Popconfirm, Button } from 'antd';
import { connect } from 'react-redux';

import { getUrl } from '../../reducers/app';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getIndexes, getTypes } from '../../reducers/mappings';
import {
	setError,
	clearError,
	updateReactiveList,
	setSelectedRows,
} from '../../actions';
import { deleteData } from '../../apis/data';

type Props = {
	selectedRows: string[],
	appUrl: string,
	indexes: string[],
	types: string[],
	setError: any => void,
	clearError: () => void,
	updateReactiveList: () => void,
	setSelectedRows: any => void,
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
		} = this.props;

		try {
			onClearError();
			await deleteData(
				indexes.join(','),
				types.join(','),
				selectedRows,
				appUrl,
			);
			setTimeout(() => {
				onUpdateReactiveList();
				onSetSelectedRows([]);
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
					type="danger"
					icon="delete"
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
});

const mapDispatchToProps = {
	setError,
	clearError,
	updateReactiveList,
	setSelectedRows,
};
export default connect(
	mpaStateToProps,
	mapDispatchToProps,
)(DeleteRows);
