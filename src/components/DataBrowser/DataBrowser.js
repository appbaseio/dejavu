// @flow

import React, { Component } from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object, number } from 'prop-types';
import { Skeleton, Button, Modal, Form, Input } from 'antd';
import JsonInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import DataTable from '../DataTable';

import { fetchMappings, addMappingRequest } from '../../actions';
import { getAppname, getUrl } from '../../reducers/app';
import * as dataSelectors from '../../reducers/data';
import { getIsLoading, getMappings } from '../../reducers/mappings';
import { parseUrl } from '../../utils';

type State = {
	showModal: boolean,
	addColumnError: boolean,
	addColumnField: string,
	addColumnMapping: object,
	isColumnFieldValid: boolean,
};

type Props = {
	appname: string,
	url: string,
	fetchMappings: () => void,
	isLoading: boolean,
	mappings: object,
	reactiveListKey: number,
	addMappingRequest: (string, object) => void,
	isDataLoading: boolean,
};

const { Item } = Form;

// after app is connected DataBrowser takes over
class DataBrowser extends Component<Props, State> {
	state = {
		showModal: false,
		addColumnError: false,
		addColumnField: '',
		isColumnFieldValid: true,
		addColumnMapping: null,
	};

	componentDidMount() {
		this.props.fetchMappings();
	}

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	};

	handleInputChange = e => {
		const { value } = e.target;
		const { appname, mappings } = this.props;
		this.setState({
			addColumnField: value,
			isColumnFieldValid: !mappings[appname].properties[value],
		});
	};

	handleJsonInput = ({ error, jsObject }) => {
		this.setState({
			addColumnError: Boolean(error),
			addColumnMapping: jsObject,
		});
	};

	addColumn = () => {
		const { addColumnError, addColumnField, addColumnMapping } = this.state;
		if (!addColumnError && addColumnField && addColumnMapping) {
			this.toggleModal();
			this.props.addMappingRequest(addColumnField, addColumnMapping);
		}
	};

	render() {
		const {
			appname,
			url: rawUrl,
			isLoading,
			mappings,
			reactiveListKey,
			isDataLoading,
		} = this.props;
		const {
			showModal,
			addColumnError,
			addColumnField,
			isColumnFieldValid,
		} = this.state;
		const { credentials, url } = parseUrl(rawUrl);
		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					mappings && (
						<ReactiveBase
							app={appname}
							type={appname} // to ignore bloat types need to rethink for multi indices
							credentials={credentials}
							url={url}
						>
							<Modal
								visible={showModal}
								onCancel={this.toggleModal}
								onOk={this.addColumn}
								okButtonProps={{
									disabled:
										addColumnError ||
										!addColumnField ||
										!isColumnFieldValid,
								}}
							>
								<Item
									label="Field Name"
									hasFeedback
									validateStatus={
										isColumnFieldValid ? '' : 'error'
									}
									help={
										!isColumnFieldValid &&
										'Duplicate field name'
									}
								>
									<Input
										name="addColumnField"
										value={addColumnField}
										onChange={this.handleInputChange}
										placeholder="Enter Field Name"
									/>
								</Item>
								<div>Mapping:</div>
								<JsonInput
									id="add-row-modal"
									locale={locale}
									placeholder={{}}
									theme="light_mitsuketa_tribute"
									style={{ outerBox: { marginTop: 20 } }}
									onChange={this.handleJsonInput}
								/>
							</Modal>
							<div
								css={{
									display: 'flex',
									flexDirection: 'row-reverse',
									margin: '20px 0',
								}}
							>
								<Button
									icon="plus"
									type="primary"
									onClick={this.toggleModal}
									loading={isDataLoading}
								>
									Add Column
								</Button>
							</div>
							<ReactiveList
								// whenever a data change is expected, the key is updated to make the ReactiveList refetch data
								// there should ideally be a hook in ReactiveSearch for this purpose but this will suffice for now
								key={String(reactiveListKey)}
								componentId="results"
								dataField="_id"
								pagination
								onAllData={data => (
									// onAllData is invoked only when data changes
									<DataTable
										// if key logic fails for an edge case will have to derive state in DataTable from props
										key={data.length ? data[0]._id : '0'}
										data={data}
										mappings={mappings[appname]}
									/>
								)}
								showResultStats={false}
							/>
						</ReactiveBase>
					)}
			</Skeleton>
		);
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
	isLoading: getIsLoading(state),
	mappings: getMappings(state),
	reactiveListKey: dataSelectors.getReactiveListKey(state),
	isDataLoading: dataSelectors.getIsLoading(state),
});

const mapDispatchToProps = {
	fetchMappings,
	addMappingRequest,
};

DataBrowser.propTypes = {
	appname: string.isRequired,
	url: string.isRequired,
	fetchMappings: func.isRequired,
	isLoading: bool.isRequired,
	mappings: object,
	reactiveListKey: number.isRequired,
	addMappingRequest: func.isRequired,
	isDataLoading: bool.isRequired,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
