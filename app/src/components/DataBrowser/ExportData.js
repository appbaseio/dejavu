// @flow
import React, { Component, Fragment } from 'react';
import { Modal, Button, Spin, Alert, Row, Col, Select } from 'antd';
import { connect } from 'react-redux';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';

import { getIndexTypeMap } from '../../reducers/mappings';
import { getUrl } from '../../reducers/app';
import { getVersion } from '../../reducers/version';
import { addDataRequest } from '../../actions';
import exportData, { flatten, MAX_DATA } from '../../utils/exportData';
import { getCount } from '../../apis';
import colors from '../theme/colors';

import Flex from '../Flex';
import Item from './Item.styles';

const { Option } = Select;
type Props = {
	url: string,
	version: number,
	indexTypeMap: any,
};

type State = {
	isShowingModal: boolean,
	isDownloading: boolean,
	isFetchingCount: boolean,
	error?: any,
	countChunks: any,
	selectedChunk: string,
	searchAfterData: string,
	selectedIndex: string,
	types: string[],
	selectedType: string,
};

class ExportData extends Component<Props, State> {
	state = {
		isShowingModal: false,
		isDownloading: false,
		isFetchingCount: false,
		error: null,
		countChunks: {},
		selectedChunk: '',
		searchAfterData: '',
		selectedIndex: Object.keys(this.props.indexTypeMap)[0],
		types: this.props.indexTypeMap[Object.keys(this.props.indexTypeMap)[0]],
		selectedType: this.props.indexTypeMap[
			Object.keys(this.props.indexTypeMap)[0]
		][0],
	};

	handleAfterClose = () => {
		this.setState({
			error: null,
			countChunks: {},
			isFetchingCount: false,
			selectedChunk: '',
			searchAfterData: '',
		});
	};

	fetchData = async () => {
		this.setState({
			isDownloading: true,
		});

		const { url, version } = this.props;
		const {
			selectedIndex,
			selectedType,
			selectedChunk,
			countChunks,
			searchAfterData,
		} = this.state;

		try {
			const { data, searchAfter } = await exportData(
				selectedIndex,
				selectedType,
				url,
				version,
				null, // use default query
				countChunks[selectedChunk],
				searchAfterData,
			);

			const chunkList = Object.keys(countChunks);
			const currentIndex = chunkList.findIndex(
				item => item === selectedChunk,
			);

			const hasNextChunk = currentIndex < chunkList.length - 1;

			this.setState({
				isDownloading: false,
				selectedChunk: hasNextChunk
					? chunkList[currentIndex + 1]
					: chunkList[0],
				searchAfterData: hasNextChunk ? `${searchAfter}` : '',
			});

			return data;
		} catch (err) {
			this.setState({
				isDownloading: false,
				error: err,
			});
			return [err];
		}
	};

	fetchCount = async () => {
		this.setState({
			isFetchingCount: true,
		});

		const { url } = this.props;
		const { selectedIndex, selectedType } = this.state;

		try {
			const data = await getCount(selectedIndex, selectedType, url);
			const count = data.count || 0;
			const chunks = {};

			if (count < MAX_DATA) {
				chunks[`0-${count}`] = {
					from: 0,
					total: count,
				};
			} else {
				const maxChunks = Math.ceil(count / MAX_DATA);
				Array(maxChunks)
					.fill(maxChunks)
					.forEach((item, index) => {
						const nextChunk = index * MAX_DATA;
						chunks[
							`${nextChunk + 1}-${
								index < maxChunks - 1
									? nextChunk + MAX_DATA
									: count
							}`
						] = {
							total:
								index < maxChunks - 1
									? MAX_DATA
									: count - nextChunk,
						};
					});
			}

			this.setState({
				isFetchingCount: false,
				countChunks: chunks,
				selectedChunk: Object.keys(chunks)[0],
			});
		} catch (err) {
			this.setState({
				isFetchingCount: false,
				error: err,
				countChunks: {},
			});
		}
	};

	toggleModal = () => {
		this.setState(
			prevState => ({
				isShowingModal: !prevState.isShowingModal,
			}),
			() => {
				if (this.state.isShowingModal) {
					this.fetchCount();
				}
			},
		);
	};

	onCSVClick = async () => {
		const { selectedChunk, selectedIndex, selectedType } = this.state;
		const res = await this.fetchData();
		const flattenData = res.map(item => flatten(item));
		const newData = unparse(flattenData);
		const file = new File(
			[newData],
			`data_${selectedIndex}_${selectedType}_${selectedChunk.replace(
				/-/g,
				'_',
			)}.csv`,
			{
				type: 'text/comma-separated-values;charset=utf-8',
			},
		);
		saveAs(file);
	};

	onJSONClick = async () => {
		const { selectedChunk, selectedIndex, selectedType } = this.state;
		const res = await this.fetchData();
		const file = new File(
			[JSON.stringify(res, null, 4)],
			`data_${selectedIndex}_${selectedType}_${selectedChunk.replace(
				/-/g,
				'_',
			)}.json`,
			{
				type: 'application/json;charset=utf-8',
			},
		);
		saveAs(file);
	};

	handlePageSelect = value => {
		this.setState({
			selectedChunk: value,
		});
	};

	resetSelectedChunk = () => {
		const { countChunks } = this.state;
		const chunkList = Object.keys(countChunks);
		this.setState({
			selectedChunk: chunkList[0],
			searchAfterData: '',
		});
	};

	handleIndexChange = selectedIndex => {
		this.setState(
			{
				selectedIndex,
				types: this.props.indexTypeMap[selectedIndex],
				selectedType: this.props.indexTypeMap[selectedIndex][0],
			},
			() => {
				this.fetchCount();
			},
		);
	};

	handleTypeChange = selectedType => {
		this.setState(
			{
				selectedType,
			},
			() => {
				this.fetchCount();
			},
		);
	};

	render() {
		const {
			isShowingModal,
			isDownloading,
			error,
			isFetchingCount,
			countChunks,
			selectedChunk,
			searchAfterData,
			selectedIndex,
			selectedType,
			types,
		} = this.state;

		const { indexTypeMap } = this.props;
		const chunkList = Object.keys(countChunks);
		return (
			<Fragment>
				<Button
					icon="download"
					css={{ marginRight: '5px' }}
					onClick={this.toggleModal}
				>
					Export
				</Button>

				<Modal
					visible={isShowingModal}
					afterClose={this.handleAfterClose}
					onCancel={this.toggleModal}
					destroyOnClose
					maskClosable={false}
					title="Export Data"
					footer={[
						<Button
							key="csv"
							type="primary"
							onClick={this.onCSVClick}
							disabled={isDownloading || isFetchingCount || error}
						>
							Download as CSV
						</Button>,
						<Button
							key="json"
							type="primary"
							onClick={this.onJSONClick}
							disabled={isDownloading || isFetchingCount || error}
						>
							Download as JSON
						</Button>,
					]}
				>
					<Row>
						<Col span={12}>
							<Item label="Index">
								<Select
									defaultValue={selectedIndex}
									onChange={this.handleIndexChange}
									css={{
										width: '95%',
									}}
								>
									{Object.keys(indexTypeMap).map(index => (
										<Option key={index} value={index}>
											{index}
										</Option>
									))}
								</Select>
							</Item>
						</Col>
						<Col span={12}>
							<Item label="Document Type">
								<Select
									value={selectedType}
									onChange={this.handleTypeChange}
									css={{
										width: '100%',
									}}
								>
									{types.map(type => (
										<Option key={type} value={type}>
											{type}
										</Option>
									))}
								</Select>
							</Item>
						</Col>
					</Row>
					<Alert
						type="info"
						description={
							<React.Fragment>
								<div>
									Data is exported in set of <b>{MAX_DATA}</b>{' '}
									Rows and in sequential manner.
								</div>
							</React.Fragment>
						}
					/>
					<br />
					{!isFetchingCount &&
						selectedChunk && (
							<p>
								Now you can export <b>{selectedChunk}</b> in CSV
								or JSON by selecting appropriate option.
							</p>
						)}

					{!isFetchingCount &&
						searchAfterData &&
						selectedChunk !== chunkList[0] && (
							<p>
								To export from beginning,{' '}
								<span
									onClick={this.resetSelectedChunk}
									css={{
										color: colors.primary,
										cursor: 'pointer',
									}}
								>
									click here to reset
								</span>
								.
							</p>
						)}
					<Flex
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
					>
						{isFetchingCount && (
							<Flex
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
							>
								<Spin css={{ marginBottom: '20px' }} />
							</Flex>
						)}
						<br />

						{isDownloading && (
							<Flex
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
							>
								<Spin css={{ marginBottom: '20px' }} />
								We are fetching the result data, please wait...
							</Flex>
						)}
					</Flex>
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	url: getUrl(state),
	version: getVersion(state),
	indexTypeMap: getIndexTypeMap(state),
});

const mapDispatchToProps = {
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ExportData);
