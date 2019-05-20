// @flow

import React, { Component } from 'react';
import { Form, Button, Alert, AutoComplete, Input, Modal, Icon } from 'antd';
import { connect } from 'react-redux';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { mediaMin } from '@divyanshu013/media';

import {
	getAppname,
	getUrl,
	getIsLoading,
	getIsConnected,
	getHeaders,
} from '../../reducers/app';
import {
	connectApp,
	disconnectApp,
	setMode,
	setError,
	setHeaders,
} from '../../actions';
import {
	getUrlParams,
	getLocalStorageItem,
	setLocalStorageData,
	getCustomHeaders,
	isMultiIndexApp,
	saveAppToLocalStorage,
	normalizeSearchQuery,
} from '../../utils';

import { getMode } from '../../reducers/mode';
import { LOCAL_CONNECTIONS, MODES } from '../../constants';

import Flex from '../Flex';

type Props = {
	appname?: string,
	url?: string,
	connectApp: (string, string) => void,
	disconnectApp: () => void,
	isConnected: boolean,
	isLoading: boolean,
	error?: object,
	history: object,
	mode: string,
	setMode: string => void,
	onErrorClose: () => void,
	location: any,
	isHidden?: boolean,
	setError: any => void,
	headers: any[],
	setHeaders: any => void,
};

type State = {
	appname: string,
	url: string,
	pastApps: any[],
	isShowingAppSwitcher: boolean,
	isUrlHidden: boolean,
	isShowingHeadersModal: boolean,
	customHeaders: any[],
};

const { Item } = Form;
const { Group } = Input;

const formItemProps = {
	wrapperCol: {
		xs: {
			span: 24,
		},
	},
};

const ROUTES_WITHOUT_MULTIPLE_INDEX = ['/mappings', '/preview', '/query'];

const shouldConnect = (pathname, appname) => {
	let isConnecting = false;

	if (ROUTES_WITHOUT_MULTIPLE_INDEX.indexOf(pathname) === -1) {
		isConnecting = true;
	} else if (!isMultiIndexApp(appname)) {
		isConnecting = true;
	} else {
		isConnecting = false;
	}

	return isConnecting;
};

class ConnectApp extends Component<Props, State> {
	state = {
		appname: this.props.appname || '',
		url: this.props.url || '',
		pastApps: [],
		isShowingAppSwitcher: true,
		isUrlHidden: false,
		isShowingHeadersModal: false,
		customHeaders: this.props.headers.length
			? this.props.headers
			: [{ key: '', value: '' }],
	};

	componentDidMount() {
		// sync state from url
		let appname = '';
		let url = '';
		const { mode, isConnected, isHidden } = this.props;
		const {
			appname: queryApp,
			url: queryUrl,
			mode: queryMode,
			sidebar,
			footer,
			appswitcher,
			route,
		} = getUrlParams(window.location.search);

		if (queryApp && queryUrl) {
			appname = queryApp;
			url = queryUrl;
		} else {
			const { appname: propApp, url: propUrl } = this.props;
			appname = propApp || '';
			url = propUrl || '';
		}

		this.setState({
			appname,
			url,
		});

		if (appname && url && !isConnected) {
			const { pathname } = this.props.location;

			if (shouldConnect(pathname, appname)) {
				this.props.connectApp(appname, url);
				saveAppToLocalStorage(appname, url);

				if (isHidden) {
					this.setAppSwitcher(false);
				}
			} else {
				this.props.setError({
					message:
						'Sorry can not connect to the app with multiple indexes',
					description: 'Please try using single index',
				});
			}
		}

		if (isConnected && isHidden) {
			this.setAppSwitcher(false);
		}

		if (!queryApp && !queryUrl) {
			let searchQuery = `?appname=${appname}&url=${url}`;
			const currentMode = queryMode || mode;
			searchQuery += `&mode=${currentMode}`;

			if (sidebar) {
				searchQuery += `&sidebar=${sidebar}`;
			}

			if (footer) {
				searchQuery += `&footer=${footer}`;
			}

			if (appswitcher) {
				searchQuery += `&appswitcher=${appswitcher}`;
			}

			if (route) {
				searchQuery += `&route=${route}`;
			}

			this.props.setMode(currentMode);
			this.props.history.push({
				search: normalizeSearchQuery(searchQuery),
			});
		}

		if (queryMode) {
			this.props.setMode(queryMode);
		}

		if (appswitcher && appswitcher === 'false') {
			this.setAppSwitcher(false);
		}

		const customHeaders = getCustomHeaders(appname);
		this.props.setHeaders(customHeaders);
		this.setState({
			customHeaders: customHeaders.length
				? customHeaders
				: [{ key: '', value: '' }],
		});
		this.setPastConnections();
	}

	setAppSwitcher = isShowingAppSwitcher => {
		this.setState({
			isShowingAppSwitcher,
		});
	};

	setPastConnections = () => {
		const pastConnections = JSON.parse(
			// $FlowFixMe
			getLocalStorageItem(LOCAL_CONNECTIONS) || {},
		);

		this.setState({
			pastApps: (pastConnections || {}).pastApps || [],
		});
	};

	handleChange = e => {
		const { value, name } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleAppNameChange = appname => {
		const { pastApps } = this.state;
		const pastApp = pastApps.find(app => app.appname === appname);

		if (pastApp) {
			this.setState({
				url: pastApp.url,
				customHeaders: pastApp.headers || [],
			});
		}
		this.setState({
			appname,
		});
	};

	handleSubmit = e => {
		e.preventDefault();
		const { appname, url, customHeaders } = this.state;
		const { sidebar, appswitcher, footer, route } = getUrlParams(
			window.location.search,
		);
		const { pathname } = this.props.location;

		let searchQuery = '?';

		if (sidebar) {
			searchQuery += `&sidebar=${sidebar}`;
		}

		if (footer) {
			searchQuery += `&sidebar=${footer}`;
		}

		if (appswitcher) {
			searchQuery += `&appswitcher=${appswitcher}`;
		}

		if (route) {
			searchQuery += `&route=${route}`;
		}

		if (this.props.isConnected) {
			this.props.disconnectApp();
			this.props.setMode(MODES.VIEW);
			this.props.setHeaders([]);
			// this.setState({
			// 	customHeaders: [{ key: '', value: '' }],
			// 	appname: '',
			// 	url: '',
			// });
			this.props.history.push({
				search: normalizeSearchQuery(searchQuery),
			});
			// window.location.reload(true);
		} else if (appname && url) {
			if (shouldConnect(pathname, appname)) {
				this.props.connectApp(appname, url);
				this.props.setHeaders(customHeaders);
				// update history with correct appname and url
				searchQuery += `&appname=${appname}&url=${url}&mode=${
					this.props.mode
				}`;
				const { pastApps } = this.state;
				const newApps = [...pastApps];

				const pastApp = pastApps.find(app => app.appname === appname);

				if (!pastApp) {
					newApps.push({
						appname,
						url,
						headers: customHeaders.filter(
							item => item.key.trim() && item.value.trim(),
						),
					});
				} else {
					const appIndex = newApps.findIndex(
						item => item.appname === appname,
					);

					newApps[appIndex] = {
						appname,
						url,
						headers: customHeaders.filter(
							item => item.key.trim() && item.value.trim(),
						),
					};
				}

				this.setState({
					pastApps: newApps,
				});

				setLocalStorageData(
					LOCAL_CONNECTIONS,
					JSON.stringify({
						pastApps: newApps,
					}),
				);
				this.props.history.push({
					search: normalizeSearchQuery(searchQuery),
				});

				if (this.props.isHidden) {
					this.setAppSwitcher(false);
				}
			} else {
				this.props.setError({
					message:
						'Sorry can not connect to the app with multiple indexes',
					description: 'Please try using single index',
				});
			}
		}
	};

	handleUrlToggle = () => {
		this.setState(({ isUrlHidden }) => ({
			isUrlHidden: !isUrlHidden,
		}));
	};

	toggleHeadersModal = () => {
		this.setState(({ isShowingHeadersModal }) => ({
			isShowingHeadersModal: !isShowingHeadersModal,
		}));
	};

	handleHeaderItemChange = (e, index, field) => {
		const {
			target: { value },
		} = e;
		const { customHeaders } = this.state;

		this.setState({
			customHeaders: [
				...customHeaders.slice(0, index),
				{
					...customHeaders[index],
					[field]: value,
				},
				...customHeaders.slice(index + 1),
			],
		});
	};

	handleHeadersSubmit = () => {
		const { customHeaders } = this.state;

		const filteredHeaders = customHeaders.filter(
			item => item.key.trim() && item.value.trim(),
		);

		const { isConnected } = this.props;

		if (isConnected) {
			const { pastApps } = JSON.parse(
				getLocalStorageItem(LOCAL_CONNECTIONS),
			);

			const currentApp = pastApps.findIndex(
				item => item.appname === this.props.appname,
			);
			pastApps[currentApp].headers = filteredHeaders;

			setLocalStorageData(
				LOCAL_CONNECTIONS,
				JSON.stringify({ pastApps }),
			);
		}
		this.props.setHeaders(filteredHeaders);
		this.toggleHeadersModal();
	};

	handleHeaderAfterClose = () => {
		this.setState({
			customHeaders: this.props.headers.length
				? this.props.headers
				: [{ key: '', value: '' }],
		});
	};

	addMoreHeader = () => {
		const { customHeaders } = this.state;

		this.setState({
			customHeaders: [...customHeaders, { key: '', value: '' }],
		});
	};

	handleRemoveHeader = index => {
		const { customHeaders } = this.state;
		this.setState({
			customHeaders: [
				...customHeaders.slice(0, index),
				...customHeaders.slice(index + 1),
			],
		});
	};

	render() {
		const {
			appname,
			url,
			pastApps,
			isShowingAppSwitcher,
			isUrlHidden,
			isShowingHeadersModal,
			customHeaders,
		} = this.state;
		const { isLoading, isConnected } = this.props;

		return (
			<div>
				{isShowingAppSwitcher && (
					<Form layout="inline" onSubmit={this.handleSubmit}>
						<Flex alignItems="center">
							<Item
								{...formItemProps}
								css={{ [mediaMin.medium]: { flex: 1 } }}
							>
								<Group
									compact
									css={{ display: 'flex !important' }}
								>
									<Input
										name="url"
										value={url}
										placeholder="URL for cluster goes here. e.g.  https://username:password@scalr.api.appbase.io"
										onChange={this.handleChange}
										disabled={isConnected}
										required
										css={{
											color:
												isUrlHidden &&
												isConnected &&
												'transparent !important',
										}}
									/>
									<Button
										css={{
											cursor: 'pointer',
											'&:hover': {
												borderColor:
													'#d9d9d9 !important',
											},
										}}
										onClick={this.handleUrlToggle}
									>
										<i
											className={`fa ${
												isUrlHidden
													? 'fa-eye-slash'
													: 'fa-eye'
											}`}
										/>
									</Button>
									<Button
										type="button"
										css={{
											'&:hover': {
												borderColor:
													'#d9d9d9 !important',
											},
										}}
										onClick={this.toggleHeadersModal}
									>
										Headers
									</Button>
								</Group>
							</Item>
							<Item
								{...formItemProps}
								css={{ [mediaMin.medium]: { flex: 0.35 } }}
							>
								<AutoComplete
									dataSource={pastApps.map(
										app => app.appname,
									)}
									value={appname}
									placeholder="Appname (aka index) goes here"
									filterOption={(inputValue, option) =>
										option.props.children
											.toUpperCase()
											.indexOf(
												inputValue.toUpperCase(),
											) !== -1
									}
									onChange={this.handleAppNameChange}
									disabled={isConnected}
								/>
							</Item>

							<Item css={{ marginRight: '0px !important' }}>
								<Button
									type={isConnected ? 'danger' : 'primary'}
									htmlType="submit"
									icon={
										isConnected
											? 'pause-circle'
											: 'play-circle'
									}
									disabled={!(appname && url)}
									loading={isLoading}
								>
									{isConnected ? 'Disconnect' : 'Connect'}
								</Button>
							</Item>
							<Modal
								visible={isShowingHeadersModal}
								onCancel={this.toggleHeadersModal}
								onOk={this.handleHeadersSubmit}
								maskClosable={false}
								destroyOnClose
								title="Add Custom Headers"
								css={{ top: 10 }}
								closable={false}
								afterClose={this.handleHeaderAfterClose}
							>
								<div
									css={{
										maxHeight: '500px',
										overflow: 'auto',
										paddingRight: 10,
									}}
								>
									<Flex css={{ marginBottom: 10 }}>
										<div
											css={{
												flex: 1,
												marginLeft: 5,
											}}
										>
											Key
										</div>
										<div
											css={{
												marginLeft: 10,
												flex: 1,
											}}
										>
											Value
										</div>
									</Flex>
									{customHeaders.map((item, i) => (
										<Flex
											key={`header-${i}`} // eslint-disable-line
											css={{ marginBottom: 10 }}
											alignItems="center"
										>
											<div
												css={{
													flex: 1,
													marginLeft: 5,
												}}
											>
												<Input
													value={item.key}
													onChange={e =>
														this.handleHeaderItemChange(
															e,
															i,
															'key',
														)
													}
												/>
											</div>
											<div
												css={{
													flex: 1,
													marginLeft: 10,
												}}
											>
												<Input
													value={item.value}
													onChange={e =>
														this.handleHeaderItemChange(
															e,
															i,
															'value',
														)
													}
												/>
											</div>
											<div
												css={{
													marginLeft: 10,
													minWidth: 15,
												}}
											>
												{customHeaders.length > 0 && (
													<Icon
														type="close"
														onClick={() =>
															this.handleRemoveHeader(
																i,
															)
														}
														css={{
															cursor: 'pointer',
														}}
													/>
												)}
											</div>
										</Flex>
									))}
								</div>
								<Button
									icon="plus"
									type="primary"
									css={{ marginTop: 10, marginLeft: 5 }}
									onClick={this.addMoreHeader}
								/>
							</Modal>
						</Flex>
					</Form>
				)}
				{!isLoading &&
					!isConnected && (
						<Alert
							type="info"
							description={
								<React.Fragment>
									<div>
										<h3 style={{ marginTop: '1rem' }}>
											Connection Tips
										</h3>
										<ul>
											<li>
												You can connect to all indices
												by passing an <code>*</code> in
												the app name input field.
											</li>
											<li>
												You can also connect to a single
												index or multiple indices by
												passing them as comma separated
												values: e.g.
												index1,index2,index3.
											</li>
											<li>
												Avoid using a trailing slash{' '}
												<code>/</code> after the cluster
												address.
											</li>
											<li>
												Your cluster needs to have CORS
												enabled for the origin where
												Dejavu is running. See below for
												more on that.
											</li>
										</ul>
										<h3>CORS Settings</h3>
										<p>
											To make sure you have enabled CORS
											settings for your ElasticSearch
											instance, add the following lines in
											the ES configuration file:
										</p>
										<pre>
											{`http.port: 9200
http.cors.allow-origin: http://localhost:1358,http://127.0.0.1:1358
http.cors.enabled: true
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true`}
										</pre>
									</div>
									<div style={{ marginTop: '2rem' }}>
										<p>
											If you are running ElasticSearch via
											Docker, use the following command:
										</p>
										<div
											style={{
												background: '#fefefe',
												padding: '8px',
											}}
										>
											<code>
												docker run --name es -d -p
												9200:9200 -e http.port=9200 -e
												http.cors.enabled=true -e
												http.cors.allow-origin=http://localhost:1358,http://127.0.0.1:1358
												-e
												http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
												-e
												http.cors.allow-credentials=true
												docker.elastic.co/elasticsearch/elasticsearch-oss:6.7.2
											</code>
										</div>
										<p style={{ marginTop: '14px' }}>
											Or the following if you are using v7
											ElasticSearch:
										</p>
										<div
											style={{
												background: '#fefefe',
												padding: '8px',
											}}
										>
											<code>
												docker run -d --rm --name
												elasticsearch -p 9200:9200 -p
												9300:9300 -e
												discovery.type=single-node -e
												http.cors.enabled=true -e
												http.cors.allow-origin=http://localhost:1358,http://127.0.0.1:1358
												-e
												http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
												-e
												http.cors.allow-credentials=true
												docker.elastic.co/elasticsearch/elasticsearch-oss:7.0.1
											</code>
										</div>
									</div>
								</React.Fragment>
							}
						/>
					)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
	isConnected: getIsConnected(state),
	isLoading: getIsLoading(state),
	mode: getMode(state),
	headers: getHeaders(state),
});

const mapDispatchToProps = {
	connectApp,
	disconnectApp,
	setMode,
	setError,
	setHeaders,
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(ConnectApp),
);
