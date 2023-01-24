// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Alert, AutoComplete, Input, Modal } from 'antd';
import {
	CloseOutlined,
	PauseCircleOutlined,
	PlayCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { object } from 'prop-types';
import { mediaMin } from '@divyanshu013/media';
import styled from 'react-emotion';

import { withRouter } from 'react-router-dom';
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
	connectApp: (string, string, any) => void,
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
	URLParams: boolean,
	showHeaders: boolean,
	forceReconnect: boolean,
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

const ConfigurationContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	width: 100%;
`;

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
		const { mode, isConnected, isHidden, forceReconnect } = this.props;
		const {
			appname: queryApp,
			url: queryUrl,
			mode: queryMode,
			sidebar,
			footer,
			appswitcher,
			route,
		} = getUrlParams(window.location.search);
		const URLParams =
			this.props.URLParams !== undefined ? this.props.URLParams : true;

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

		// when you want to explicitly trigger reconnect even when app is connect pass `forceReconnect=true`

		if (appname && url && (forceReconnect || !isConnected)) {
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

		if (!queryApp && !queryUrl && URLParams) {
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

	handleSubmit = () => {
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
				this.props.connectApp(appname, url, customHeaders);
				this.props.setHeaders(customHeaders);
				// update history with correct appname and url
				searchQuery += `&appname=${appname}&url=${url}&mode=${this.props.mode}`;
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

	handleHeadersSubmit = e => {
		e.preventDefault();
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
		const showHeaders =
			this.props.showHeaders !== undefined
				? this.props.showHeaders
				: true;

		return (
			<div>
				{isShowingAppSwitcher && showHeaders && (
					<Form
						style={{ marginBottom: 10 }}
						layout="inline"
						onFinish={this.handleSubmit}
					>
						<ConfigurationContainer>
							<Item {...formItemProps} style={{ flex: 1 }}>
								<Group
									compact
									css={{ display: 'flex !important' }}
								>
									<Input.Password
										name="url"
										value={url}
										placeholder="URL for cluster goes here. e.g.  https://username:password@scalr.api.appbase.io"
										onChange={this.handleChange}
										disabled={isConnected}
										required
										visibilityToggle={{
											visible: !isUrlHidden,
											onVisibleChange: this
												.handleUrlToggle,
										}}
										css={{
											color:
												isUrlHidden &&
												isConnected &&
												'transparent !important',
											width: '100%',
										}}
									/>
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
							<Item>
								<AutoComplete
									options={pastApps.map(app => ({
										value: app.appname,
									}))}
									value={appname}
									filterOption={(inputValue, option) =>
										option.value.includes(inputValue)
									}
									style={{ width: 200 }}
									onChange={this.handleAppNameChange}
									onSelect={this.handleAppNameChange}
									disabled={isConnected}
									placeholder="Enter index"
									spellcheck="false"
									autocorrect="off"
									autocapitalize="off"
								/>
							</Item>

							<Item css={{ marginRight: '0px !important' }}>
								<Button
									type={isConnected ? undefined : 'primary'}
									danger={isConnected}
									ghost={isConnected}
									htmlType="submit"
									icon={
										isConnected ? (
											<PauseCircleOutlined />
										) : (
											<PlayCircleOutlined />
										)
									}
									disabled={!(appname && url)}
									loading={isLoading}
								>
									{isConnected ? 'Disconnect' : 'Connect'}
								</Button>
							</Item>
							<Modal
								open={isShowingHeadersModal}
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
													<CloseOutlined
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
									icon={<PlusOutlined />}
									type="primary"
									css={{ marginTop: 10, marginLeft: 5 }}
									onClick={this.addMoreHeader}
								/>
							</Modal>
						</ConfigurationContainer>
					</Form>
				)}
				{!isLoading && !isConnected && (
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
											You can connect to all indices by
											passing an <code>*</code> in the app
											name input field.
										</li>
										<li>
											You can also connect to a single
											index or multiple indices by passing
											them as comma separated values: e.g.
											index1,index2,index3.
										</li>
										<li>
											Avoid using a trailing slash{' '}
											<code>/</code> after the cluster
											address.
										</li>
										<li>
											Your cluster needs to have CORS
											enabled for the origin where Dejavu
											is running. See below for more on
											that.
										</li>
									</ul>
									<h3>CORS Settings</h3>
									<p>
										To make sure you have enabled CORS
										settings for your Elasticsearch
										instance, add the following lines in the
										ES configuration file:
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
										If you are running Elasticsearch via
										Docker, use the following command:
									</p>
									<div
										style={{
											background: '#fefefe',
											padding: '8px',
										}}
									>
										<code>
											docker run -d --rm --name
											elasticsearch -p 127.0.0.1:9200:9200
											-e http.port=9200 -e
											discovery.type=single-node -e
											http.max_content_length=10MB -e
											http.cors.enabled=true -e
											http.cors.allow-origin=\* -e
											http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
											-e http.cors.allow-credentials=true
											-e network.publish_host=localhost -e
											xpack.security.enabled=false
											docker.elastic.co/elasticsearch/elasticsearch:8.1.0
										</code>
									</div>
									<p style={{ marginTop: '14px' }}>
										Or the following if you are using
										OpenSearch:
									</p>
									<div
										style={{
											background: '#fefefe',
											padding: '8px',
										}}
									>
										<code>
											docker run --name opensearch --rm -d
											-p 9200:9200 -e http.port=9200 -e
											discovery.type=single-node -e
											http.max_content_length=10MB -e
											http.cors.enabled=true -e
											http.cors.allow-origin=\* -e
											http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
											-e http.cors.allow-credentials=true
											opensearchproject/opensearch:1.2.4
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

const mapStateToProps = (state, props) => {
	const getURL = () => {
		if (props.url && props.url.trim() !== '') return props.url;
		if (props.credentials)
			return `https://${props.credentials}@scalr.api.appbase.io`;
		return getUrl(state);
	};
	return {
		appname: props.app || getAppname(state),
		url: getURL(),
		isConnected: getIsConnected(state),
		isLoading: getIsLoading(state),
		mode: getMode(state),
		headers: getHeaders(state),
	};
};

const mapDispatchToProps = {
	connectApp,
	disconnectApp,
	setMode,
	setError,
	setHeaders,
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ConnectApp),
);
