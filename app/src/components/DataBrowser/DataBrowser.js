// @flow

import React, { Component } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { Skeleton } from 'antd';
import { mediaMin } from '@divyanshu013/media';

import Flex from '../Flex';
import Actions from './Actions';
import AddRowModal from './AddRowModal';
import AddFieldModal from './AddFieldModal';
import DataTableHeader from './DataTableHeader';
import NestedColumnToggle from './NestedColumnToggle';
import GlobalSearch from './GlobalSearch';
import ResultList from './ResultSet';
import CloneApp from './CloneApp';
import Loader from '../Loader';

import { fetchMappings } from '../../actions';
import { getUrl, getHeaders } from '../../reducers/app';
import * as dataSelectors from '../../reducers/data';
import {
	getIsLoading,
	getMappings,
	getIndexes,
	getTypes,
} from '../../reducers/mappings';
import { parseUrl, convertArrayToHeaders, getUrlParams } from '../../utils';
import colors from '../theme/colors';

type Props = {
	url: string,
	fetchMappings: () => void,
	isLoading: boolean,
	mappings: any,
	isDataLoading: boolean,
	indexes: string[],
	types: string[],
	headers: any[],
};

class DataBrowser extends Component<Props> {
	componentDidMount() {
		this.props.fetchMappings();
	}

	handleReload = () => {
		this.props.fetchMappings();
	};

	render() {
		const {
			url: rawUrl,
			isLoading,
			mappings,
			isDataLoading,
			indexes,
			headers,
		} = this.props;
		const { credentials, url } = parseUrl(rawUrl);

		const otherBaseProps = headers.filter(
			item => item.key.trim() && item.value.trim(),
		).length
			? { headers: convertArrayToHeaders(headers) }
			: {};
		const { appswitcher } = getUrlParams(window.location.search);
		const hideAppSwitcher = appswitcher && appswitcher === 'false';

		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					!isDataLoading &&
					mappings && (
						<div css={{ position: 'relative' }}>
							<ReactiveBase
								app={indexes.join(',')}
								credentials={credentials}
								url={url}
								{...otherBaseProps}
							>
								<div>
									<Actions onReload={this.handleReload} />
									<NestedColumnToggle />
									<GlobalSearch />
								</div>
								<div
									css={{
										position: 'relative',
									}}
								>
									<div
										id="result-list"
										css={{
											marginTop: '20px',
											border: `1px solid ${
												colors.tableBorderColor
											}`,
											borderRadius: 3,
											widht: '100%',
											maxHeight:
												window.innerHeight -
												(hideAppSwitcher ? 250 : 350),
											minHeight: 200,
											overflowX: 'auto',
										}}
									>
										<DataTableHeader />
										<ResultList />
									</div>
								</div>
							</ReactiveBase>
						</div>
					)}
				{mappings && (
					<Flex
						css={{
							marginTop: 100,
							[mediaMin.medium]: {
								marginTop: 10,
							},
						}}
						wrap="no-wrap"
						alignItems="center"
					>
						<CloneApp />
						<AddRowModal />
						<AddFieldModal />
					</Flex>
				)}
			</Skeleton>
		);
	}
}

const mapStateToProps = state => ({
	url: getUrl(state),
	isLoading: getIsLoading(state),
	mappings: getMappings(state),
	isDataLoading: dataSelectors.getIsLoading(state),
	indexes: getIndexes(state),
	types: getTypes(state),
	headers: getHeaders(state),
});

const mapDispatchToProps = {
	fetchMappings,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DataBrowser);
