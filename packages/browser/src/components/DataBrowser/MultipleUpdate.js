// @flow

import React, { Component, Fragment } from 'react';
import { Modal, Select, Button } from 'antd';
import { CloseOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import {
	getMappings,
	getColumns,
	getIndexes,
	getTypes,
} from '../../reducers/mappings';
import { getAppname, getUrl } from '../../reducers/app';
import { getSelectedRows } from '../../reducers/selectedRows';
import { getApplyQuery } from '../../reducers/applyQuery';
import { getQuery } from '../../reducers/query';
import { getStats } from '../../reducers/stats';
import { getVersion } from '../../reducers/version';

import { META_FIELDS } from '../../utils/mappings';
import labelStyles from '../CommonStyles/label';
import colors from '../theme/colors';
import { bulkUpdate } from '../../apis/data';
import { numberWithCommas } from '../../utils';
import {
	setError,
	clearError,
	updateReactiveList,
	setSelectAll,
	setApplyQuery,
} from '../../actions';

import Flex from '../Flex';
import Cell from '../Cell';
import MappingsDropdown from '../MappingsDropdown';

const { Option } = Select;

type Props = {
	columns: string[],
	mappings: any,
	appname: string,
	selectedIds: string[],
	appUrl: string,
	indexes: string[],
	types: string[],
	setError: any => void,
	clearError: () => void,
	updateReactiveList: () => void,
	applyQuery: boolean,
	query: any,
	onSetApplyQuery: boolean => void,
	onSetSelectAll: boolean => void,
	stats: any,
	version: number,
};

type State = {
	isShowingModal: boolean,
	data: any,
	isSavingData: boolean,
};

class MultipleUpdate extends Component<Props, State> {
	state = {
		isShowingModal: false,
		data: [
			{
				field: undefined,
				value: null,
			},
		],
		isSavingData: false,
	};

	handleAfterClose = () => {
		this.setState({
			isShowingModal: false,
			data: [
				{
					field: undefined,
					value: null,
				},
			],
			isSavingData: false,
		});
	};

	handleSavingDataChange = isSavingData => {
		this.setState({
			isSavingData,
		});
	};

	toggleModal = () => {
		this.setState(prevState => ({
			isShowingModal: !prevState.isShowingModal,
		}));
	};

	handleBulkUpdate = async () => {
		const {
			appUrl,
			indexes,
			types,
			selectedIds,
			applyQuery,
			query,
			setError: onSetError,
			clearError: onClearError,
			updateReactiveList: onUpdateReactiveList,
			onSetApplyQuery,
			onSetSelectAll,
			version,
		} = this.props;
		const { data } = this.state;
		const queryData = applyQuery ? query.query : selectedIds;

		if (data[0].value !== null) {
			this.handleSavingDataChange(true);
			try {
				onClearError();
				await bulkUpdate(
					appUrl,
					indexes.join(','),
					types.join(','),
					queryData,
					data,
					version,
				);

				this.handleSavingDataChange(false);
				onUpdateReactiveList();
				onSetSelectAll(false);
				onSetApplyQuery(false);
				this.toggleModal();
			} catch (error) {
				this.handleSavingDataChange(false);
				onSetError(error);
			}
		} else {
			this.toggleModal();
		}
	};

	handleColumnChange = (index, column) => {
		const { data } = this.state;
		const hasSameColumn = data.find(item => item.field === column);

		if (!hasSameColumn) {
			this.setState({
				data: [
					...data.slice(0, index),
					{
						field: column,
						value: null,
					},
					...data.slice(index + 1),
				],
			});
		}
	};

	handleRemoveData = index => {
		const { data } = this.state;

		if (data.length > 1) {
			this.setState({
				data: [...data.slice(0, index), ...data.slice(index + 1)],
			});
		} else {
			this.setState({
				data: [
					{
						field: undefined,
						value: null,
					},
				],
			});
		}
	};

	handleDataValueChange = (index, value) => {
		const { data } = this.state;

		this.setState({
			data: [
				...data.slice(0, index),
				{
					...data[index],
					value,
				},
				...data.slice(index + 1),
			],
		});
	};

	handleAddMoreFields = () => {
		this.setState(prevState => ({
			data: [
				...prevState.data,
				{
					field: undefined,
					value: null,
				},
			],
		}));
	};

	render() {
		const { data, isShowingModal, isSavingData } = this.state;
		const {
			columns,
			mappings,
			appname,
			stats,
			selectedIds,
			applyQuery,
		} = this.props;
		const { properties } = mappings[appname];
		return (
			<Fragment>
				<Button
					icon={<EditOutlined />}
					type="primary"
					css={{
						margin: '0 3px',
					}}
					onClick={this.toggleModal}
				>
					Update Multiple Rows
				</Button>

				<Modal
					open={isShowingModal}
					onCancel={this.toggleModal}
					footer={null}
					title={`Update Multiple Rows (${
						applyQuery
							? numberWithCommas(stats.totalResults)
							: selectedIds.length
					} docs selected)`}
					css={{
						top: '10px',
					}}
					className={labelStyles}
					destroyOnClose
					maskClosable={false}
					afterClose={this.handleAfterClose}
				>
					{data.map((item, i) => (
						<Flex flexDirection="column" key={item.field || i}>
							<Flex
								justifyContent="flex-end"
								alignItems="center"
								css={{
									marginRight: 25,
									height: properties[item.field] ? 'auto' : 0,
								}}
							>
								{properties[item.field] &&
									properties[item.field].type}{' '}
								&nbsp;
								{properties[item.field] && (
									<MappingsDropdown
										mapping={properties[item.field]}
									/>
								)}
							</Flex>
							<Flex alignItems="center">
								<div css={{ flex: 1, marginLeft: 5 }}>
									<Select
										showSearch
										placeholder="Field"
										value={item.field}
										onChange={column =>
											this.handleColumnChange(i, column)
										}
										filterOption={(input, option) =>
											option.props.children
												.toLowerCase()
												.indexOf(input.toLowerCase()) >=
											0
										}
										css={{
											width: '90%',
										}}
									>
										{columns
											.filter(
												col =>
													!data.find(
														x => x.field === col,
													),
											)
											.map(field => (
												<Option
													value={field}
													key={field}
												>
													{field}
												</Option>
											))}
									</Select>
								</div>
								<div
									css={{
										flex: 1,
										marginLeft: 10,
									}}
								>
									{item.field ? (
										<div
											css={{
												border: `1px solid ${colors.tableBorderColor}`,
												borderRadius: 3,
												padding: '5px 7px',
											}}
										>
											<Cell
												mapping={properties[item.field]}
												onChange={val =>
													this.handleDataValueChange(
														i,
														val,
													)
												}
												active
												mode="edit"
												editable
											>
												{item.value}
											</Cell>
										</div>
									) : (
										<div>Please select field...</div>
									)}
								</div>
								<div
									css={{
										marginLeft: 10,
										minWidth: 15,
									}}
								>
									{data.length > 0 && (
										<CloseOutlined
											type="close"
											onClick={() =>
												this.handleRemoveData(i)
											}
											css={{
												cursor: 'pointer',
											}}
										/>
									)}
								</div>
							</Flex>
						</Flex>
					))}

					<Flex
						justifyContent="space-between"
						css={{
							marginTop: 25,
						}}
					>
						<Button
							icon={<PlusOutlined />}
							type="primary"
							css={{
								marginLeft: 5,
							}}
							onClick={this.handleAddMoreFields}
						/>
						<Button
							onClick={this.handleBulkUpdate}
							loading={isSavingData}
						>
							Save
						</Button>
					</Flex>
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	columns: getColumns(state).filter(x => META_FIELDS.indexOf(x) === -1),
	mappings: getMappings(state),
	appname: getAppname(state),
	appUrl: getUrl(state),
	selectedIds: getSelectedRows(state),
	indexes: getIndexes(state),
	types: getTypes(state),
	applyQuery: getApplyQuery(state),
	query: getQuery(state),
	stats: getStats(state),
	version: getVersion(state),
});

const mapDispatchToProps = {
	setError,
	clearError,
	updateReactiveList,
	onSetApplyQuery: setApplyQuery,
	onSetSelectAll: setSelectAll,
};

export default connect(mapStateToProps, mapDispatchToProps)(MultipleUpdate);
