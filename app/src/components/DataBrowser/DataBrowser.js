// @flow

import React, { Component, createRef } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { connect } from 'react-redux';
import { Skeleton } from 'antd';
import { mediaMin } from '@divyanshu013/media';
import { AutoSizer } from 'react-virtualized';
import { injectGlobal } from 'emotion';

import Flex from '../Flex';
import AddRowModal from './AddRowModal';
import AddFieldModal from './AddFieldModal';
import DataTableHeader from '../DataTable/DataTableHeader';
import GlobalSearch from './GlobalSearch';
import ResultList from './ResultSet';
import CloneApp from './CloneApp';

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
import PromotedResultsContainer from './PromotedResultsContainer';
import PromotedResults from './PromotedResults';
import HiddenResults from './HiddenResults';
import BackButton from './BackButton';
import QueryInfo from './QueryInfo';
import AppPlanWrapper from './AppPlanWrapper';
import NestedColumnToggle from './NestedColumnToggle';

type Props = {
	url: string,
	fetchMappings: () => void,
	isLoading: boolean,
	mappings: any,
	isDataLoading: boolean,
	indexes: string[],
	types: string[],
	headers: any[],
	searchTerm: string,
};

injectGlobal`
	*{
		font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif;
	}
`;

class DataBrowser extends Component<Props> {
	headerRef = createRef();

	promotedHeaderRef = createRef();

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
			searchTerm,
		} = this.props;
		const { credentials, url } = parseUrl(rawUrl);
		let baseProps = { url, app: indexes.join(',') };

		if (credentials) {
			baseProps = { ...baseProps, credentials };
		}
		const customHeaders = headers.filter(
			item => item.key.trim() && item.value.trim(),
		);

		if (customHeaders.length) {
			baseProps = {
				...baseProps,
				headers: convertArrayToHeaders(headers),
			};
		}

		const { appswitcher, showActions, appname } = getUrlParams(
			window.location.search,
		);
		const hideAppSwitcher = appswitcher && appswitcher === 'false';
		let areActionsVisisble = true;

		if (showActions && showActions === 'false') {
			areActionsVisisble = false;
		}
		return (
			<Skeleton loading={isLoading} active>
				{!isLoading &&
					!isDataLoading &&
					mappings && (
						<div css={{ position: 'relative', padding: 20 }}>
							<ReactiveBase {...baseProps}>
								<div>
									<NestedColumnToggle />
									<GlobalSearch searchTerm={searchTerm} />
								</div>
								<PromotedResultsContainer>
									<AppPlanWrapper appName={appname}>
										<BackButton />

										<PromotedResults />

										<HiddenResults />

										<div
											css={{
												boxShadow:
													'0 1px 10px -2px rgba(0,0,0,0.2)',
												borderLeft: '4px solid #d9d9d9',
											}}
										>
											<QueryInfo />

											<div
												id="result-list"
												css={{
													marginTop: '20px',
													border: `1px solid ${
														colors.tableBorderColor
													}`,
													borderRadius: 3,
													width: '100%',
													position: 'relative',
													height:
														window.innerHeight -
														(hideAppSwitcher
															? 250
															: 350),
													overflow: 'visible',
												}}
											>
												<AutoSizer
													css={{
														height:
															'100% !important',
														width:
															'100% !important',
													}}
												>
													{({ height, width }) => (
														<>
															<DataTableHeader
																ref={
																	this
																		.headerRef
																}
															/>
															<ResultList
																height={height}
																width={width}
																headerRef={
																	this
																		.headerRef
																}
															/>
														</>
													)}
												</AutoSizer>
											</div>
										</div>
									</AppPlanWrapper>
								</PromotedResultsContainer>
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
							paddingBottom: !areActionsVisisble ? '30px' : 0,
						}}
						wrap="no-wrap"
						alignItems="center"
					>
						<CloneApp />
						{areActionsVisisble && <AddRowModal />}
						{areActionsVisisble && <AddFieldModal />}
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
