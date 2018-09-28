// @flow

import React, { Component } from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { string, func } from 'prop-types';

import DataTable from '../DataTable';

import { fetchMappings } from '../../actions';
import { getAppname, getUrl } from '../../reducers/app';
import { parseUrl } from '../../utils';

type Props = {
	appname: string,
	url: string,
	fetchMappings: () => void,
};

// after app is connected DataBrowser takes over
class DataBrowser extends Component<Props> {
	componentDidMount() {
		this.props.fetchMappings();
	}

	render() {
		const { appname, url: rawUrl } = this.props;
		const { credentials, url } = parseUrl(rawUrl);
		return (
			<ReactiveBase app={appname} credentials={credentials} url={url}>
				<ReactiveList
					componentId="results"
					dataField="_id"
					pagination
					onAllData={data => <DataTable data={data} />}
				/>
			</ReactiveBase>
		);
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
});

const mapDispatchToProps = {
	fetchMappings,
};

DataBrowser.propTypes = {
	appname: string.isRequired,
	url: string.isRequired,
	fetchMappings: func.isRequired,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
