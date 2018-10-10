// @flow

import React, { Component } from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object, number } from 'prop-types';
import { Skeleton } from 'antd';

import DataTable from '../DataTable';

import { fetchMappings } from '../../actions';
import { getAppname, getUrl } from '../../reducers/app';
import { getReactiveListKey } from '../../reducers/data';
import { getIsLoading, getMappings } from '../../reducers/mappings';
import { parseUrl } from '../../utils';

type Props = {
	appname: string,
	url: string,
	fetchMappings: () => void,
	isLoading: boolean,
	mappings: object,
	reactiveListKey: number,
};

// after app is connected DataBrowser takes over
class DataBrowser extends Component<Props> {
	componentDidMount() {
		this.props.fetchMappings();
	}

	render() {
		const {
			appname,
			url: rawUrl,
			isLoading,
			mappings,
			reactiveListKey,
		} = this.props;
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
	reactiveListKey: getReactiveListKey(state),
});

const mapDispatchToProps = {
	fetchMappings,
};

DataBrowser.propTypes = {
	appname: string.isRequired,
	url: string.isRequired,
	fetchMappings: func.isRequired,
	isLoading: bool.isRequired,
	mappings: object,
	reactiveListKey: number.isRequired,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
