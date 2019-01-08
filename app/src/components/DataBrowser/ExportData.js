// @flow
import React, { Component, Fragment } from 'react';
import { Modal, Button, Spin, Alert } from 'antd';
import { connect } from 'react-redux';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';

import { getIndexes, getTypes } from '../../reducers/mappings';
import { getUrl } from '../../reducers/app';
import { addDataRequest } from '../../actions';
import exportData, { flatten, MAX_DATA } from '../../utils/exportData';
import { getCount } from '../../apis';
import colors from '../theme/colors';

import Flex from '../Flex';

type Props = {
	indexes: string[],
	types: string[],
	url: string,
};

type State = {
	isShowingModal: boolean,
	isDownloading: boolean,
	isFetchingCount: boolean,
	error?: any,
	countChunks: any,
	selectedChunk: string,
	searchAfterData: string,
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
		const { url, indexes, types } = this.props;
		const { selectedChunk, countChunks, searchAfterData } = this.state;

		try {
			const { data, searchAfter } = await exportData(
				indexes.join(','),
				types.join(','),
				url,
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

		const { url, indexes, types } = this.props;
		try {
			const data = await getCount(
				indexes.join(','),
				types.join(','),
				url,
			);
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
		const { selectedChunk } = this.state;
		const res = await this.fetchData();
		const flattenData = res.map(item => flatten(item));
		const newData = unparse(flattenData);
		const file = new File(
			[newData],
			`data_${selectedChunk.replace(/-/g, '_')}.csv`,
			{
				type: 'text/comma-separated-values;charset=utf-8',
			},
		);
		saveAs(file);
	};

	onJSONClick = async () => {
		const { selectedChunk } = this.state;
		const res = await this.fetchData();
		const file = new File(
			[JSON.stringify(res, null, 4)],
			`data_${selectedChunk.replace(/-/g, '_')}.json`,
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

	render() {
		const {
			isShowingModal,
			isDownloading,
			error,
			isFetchingCount,
			countChunks,
			selectedChunk,
			searchAfterData,
		} = this.state;

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
					<Alert
						type="info"
						showIcon
						description={
							<React.Fragment>
								<div>
									Data is exported in set of <b>{MAX_DATA}</b>{' '}
									Rows and in sequential manner. To start
									download from first
								</div>
							</React.Fragment>
						}
					/>
					<br />
					{selectedChunk && (
						<p>
							Now you can export <b>{selectedChunk}</b> in CSV or
							JSON by selecting appropriate option.
						</p>
					)}

					{searchAfterData &&
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
	indexes: getIndexes(state),
	types: getTypes(state),
	url: getUrl(state),
});

const mapDispatchToProps = {
	addDataRequest,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ExportData);
