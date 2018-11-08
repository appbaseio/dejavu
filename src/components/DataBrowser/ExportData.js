// @flow
import React, { Component, Fragment } from 'react';
import { Modal, Button, Spin } from 'antd';
import { arrayOf, string, object, array } from 'prop-types';
import { connect } from 'react-redux';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';

import { getIndexes, getTypes } from '../../reducers/mappings';
import { getUrl } from '../../reducers/app';
import { addDataRequest } from '../../actions';
import exportData, { flatten } from '../../utils/exportData';

import Flex from '../Flex';

type Props = {
	indexes: string[],
	types: string[],
	url: string,
};

type State = {
	isShowingModal: boolean,
	isDownloading: boolean,
	error?: object,
	data: array,
};

class ExportData extends Component<Props, State> {
	state = {
		isShowingModal: false,
		isDownloading: false,
		error: null,
		data: [],
	};

	handleAfterClose = () => {
		this.setState({
			error: null,
			data: [],
		});
	};

	fetchData = async () => {
		this.setState({
			isDownloading: true,
		});
		const { url, indexes, types } = this.props;
		try {
			const data = await exportData(url, indexes, types);
			this.setState({
				isDownloading: false,
				data,
			});
		} catch (err) {
			this.setState({
				isDownloading: false,
				error: err,
				data: [],
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
					this.fetchData();
				}
			},
		);
	};

	onCSVClick = () => {
		const { data } = this.state;
		const flattenData = data.map(item => flatten(item));
		const newData = unparse(flattenData);
		const file = new File([newData], 'data.csv', {
			type: 'text/comma-separated-values;charset=utf-8',
		});
		saveAs(file);
	};

	onJSONClick = () => {
		const { data } = this.state;
		const file = new File([JSON.stringify(data, null, 4)], 'data.json', {
			type: 'application/json;charset=utf-8',
		});
		saveAs(file);
	};

	render() {
		const { isShowingModal, isDownloading, error } = this.state;
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
					destroyOnHide
					maskClosable={false}
					title="Export Data"
					footer={[
						<Button
							key="csv"
							type="primary"
							onClick={this.onCSVClick}
							disabled={isDownloading || error}
						>
							Download as CSV
						</Button>,
						<Button
							key="json"
							type="primary"
							onClick={this.onJSONClick}
							disabled={isDownloading || error}
						>
							Download as JSON
						</Button>,
					]}
				>
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

					{!isDownloading &&
						!error && (
							<Flex
								justifyContent="center"
								flexDirection="column"
								alignItems="center"
							>
								Download the result data as a JSON or CSV file.
							</Flex>
						)}
				</Modal>
			</Fragment>
		);
	}
}

ExportData.propTypes = {
	indexes: arrayOf(string),
	types: arrayOf(string),
	url: string,
};

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
