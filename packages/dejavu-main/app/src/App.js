import React, { Component, lazy, Suspense } from 'react';
import { Layout, Modal, Skeleton } from 'antd';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mediaMin } from '@divyanshu013/media';
import {
	Flex,
	utils,
	constants,
	store,
	colors,
} from '@appbaseio/dejavu-browser';

import Navigation from './components/Navigation';
import NoMatch from './components/NoMatch';
import OldDejavuBanner from './components/OldDejavuBanner';

import logo from './images/dejavu-logo.svg';

const SearchPreview = lazy(() => import('./components/SearchPreview'));
const DataBrowser = lazy(() => import('@appbaseio/dejavu-browser'));
const QueryExplorer = lazy(() => import('./components/QueryExplorer'));

const { getUrlParams, getLocalStorageItem, setLocalStorageData } = utils;
const { LOCAL_CONNECTIONS } = constants;

const { Content, Sider } = Layout;

function withSuspense(ChildComponent, props) {
	return (
		<Suspense fallback={<Skeleton />}>
			<ChildComponent {...props} />
		</Suspense>
	);
}

class App extends Component {
	state = {
		isShowingSideBar: true,
		isShowingFooter: true,
		isShowingVideo: false,
	};

	componentDidMount() {
		const { sidebar, footer } = getUrlParams(window.location.search);

		if (sidebar && sidebar === 'false') {
			this.setSideBarVisibility(false);
		}

		if (footer && footer === 'false') {
			this.setFooterVisibility(false);
		}

		const localConnections = getLocalStorageItem(LOCAL_CONNECTIONS);

		if (!localConnections) {
			setLocalStorageData(
				LOCAL_CONNECTIONS,
				JSON.stringify({
					pastApps: [],
				}),
			);
		}
	}

	setSideBarVisibility = isShowingSideBar => {
		this.setState({
			isShowingSideBar,
		});
	};

	setFooterVisibility = isShowingFooter => {
		this.setState({
			isShowingFooter,
		});
	};

	showVideoModal = () => {
		this.setState({
			isShowingVideo: true,
		});
	};

	hideVideoModal = () => {
		this.setState({
			isShowingVideo: false,
		});
	};

	renderExtensionRoutes = () => {
		const { route } = getUrlParams(window.location.search);

		if (route) {
			if (route === 'preview') {
				return withSuspense(SearchPreview);
			}

			if (route === 'query') {
				return withSuspense(QueryExplorer);
			}

			return withSuspense(DataBrowser);
		}

		return withSuspense(DataBrowser);
	};

	render() {
		const {
			isShowingSideBar,
			isShowingFooter,
			isShowingVideo,
		} = this.state;
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Layout
						css={{ minHeight: isShowingSideBar ? '100vh' : 'auto' }}
					>
						{isShowingSideBar && (
							<Sider
								theme="light"
								css={{
									display: 'none',
									[mediaMin.medium]: {
										display: 'block',
									},
								}}
							>
								<img
									src={logo}
									alt="Dejavu"
									width="100%"
									css={{ padding: 25 }}
								/>
								<Navigation />
							</Sider>
						)}
						<Layout css={{ overflowX: 'hidden !important' }}>
							<OldDejavuBanner />
							<Content
								css={{
									margin: isShowingSideBar ? '15px 25px' : 0,
									height: isShowingFooter ? '95%' : '100%',
								}}
							>
								<div
									css={{
										padding: 20,
										background: '#fff',
									}}
								>
									<Switch>
										<Route
											exact
											path="/"
											render={props =>
												withSuspense(DataBrowser, props)
											}
										/>
										<Route
											path="/preview"
											render={props =>
												withSuspense(
													SearchPreview,
													props,
												)
											}
										/>
										<Route
											path="/query"
											render={props =>
												withSuspense(
													QueryExplorer,
													props,
												)
											}
										/>
										<Route
											path="/browse"
											render={() => (
												<Redirect
													to={{
														pathname: '/',
														search:
															window.location
																.search,
													}}
												/>
											)}
										/>
										{/* Special cases for chrome extension */}
										<Route
											path="/index.html"
											render={this.renderExtensionRoutes}
										/>
										<Route
											path="/404"
											component={NoMatch}
										/>
										<Route component={NoMatch} />
									</Switch>
								</div>
							</Content>
						</Layout>
						{isShowingFooter && (
							<Flex
								css={{
									position: 'fixed',
									width: '100%',
									bottom: 0,
									zIndex: 1001,
									height: 30,
									background: colors.white,
									padding: '5px 10px',
								}}
								justifyContent="space-between"
							>
								<iframe
									src="https://ghbtns.com/github-btn.html?user=appbaseio&repo=dejavu&type=star&count=true"
									scrolling="0"
									width="120px"
									height="20px"
									frameBorder="0"
									title="github-stars"
								/>
								<div>
									{/* eslint-disable-next-line */}
									<a onClick={this.showVideoModal}>
										Watch Video
									</a>
									<Modal
										open={isShowingVideo}
										onCancel={this.hideVideoModal}
										width={610}
										footer={null}
										destroyOnClose
									>
										<br />
										{isShowingVideo && (
											<iframe
												src="https://www.youtube.com/embed/qhDuRd2pJIY?rel=0&amp;showinfo=0"
												allow="autoplay; encrypted-media"
												width="560"
												height="315"
												frameBorder="0"
												title="video"
											/>
										)}
									</Modal>
								</div>
								<div>
									Create your <b>Elasticsearch</b> in cloud
									with{' '}
									<a
										href="https://appbase.io?utm_source=dejavu&utm_medium=footer&utm_campaign=appbaseio"
										target="_blank"
										rel="noopener noreferrer"
									>
										appbase.io
									</a>
								</div>
							</Flex>
						)}
					</Layout>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
