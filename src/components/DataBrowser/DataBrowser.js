// @flow

import React, { Component } from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func, bool, object } from 'prop-types';
import { Skeleton } from 'antd';

import DataTable from '../DataTable';

import { fetchMappings } from '../../actions';
import { getAppname, getUrl } from '../../reducers/app';
import { getIsLoading, getMappings } from '../../reducers/mappings';
import { parseUrl } from '../../utils';

type Props = {
	appname: string,
	url: string,
	fetchMappings: () => void,
	isLoading: boolean,
	mappings: object,
};

// after app is connected DataBrowser takes over
class DataBrowser extends Component<Props> {
	componentDidMount() {
		this.props.fetchMappings();
	}

	render() {
		const { appname, url: rawUrl, isLoading, mappings } = this.props;
		const { credentials, url } = parseUrl(rawUrl);
		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					mappings && (
						<ReactiveBase
							app={appname}
							credentials={credentials}
							url={url}
						>
							<ReactiveList
								componentId="results"
								dataField="_id"
								pagination
								onAllData={data => (
									<DataTable
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
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
