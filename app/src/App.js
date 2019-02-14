import React, { Component } from 'react';
import { Layout, Modal } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mediaMin } from '@divyanshu013/media';

import Dejavu from './components/Dejavu';
import SearchPreview from './components/SearchPreview';
// import Mappings from './components/Mappings';
import Navigation from './components/Navigation';
import NoMatch from './components/NoMatch';
import QueryExplorer from './components/QueryExplorer';
import Flex from './components/Flex';
import OldDejavuBanner from './components/OldDejavuBanner';

import configureStore from './store';
import {
	getUrlParams,
	getLocalStorageItem,
	setLocalStorageData,
} from './utils';
import { LOCAL_CONNECTIONS } from './constants';
import colors from './components/theme/colors';

import logo from './images/dejavu-logo.svg';

const { Content, Sider } = Layout;
const store = configureStore();

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
						<Layout>
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
											component={Dejavu}
										/>
										{/* Special case for chrom extension */}
										<Route
											exact
											path="/index.html"
											component={Dejavu}
										/>
										<Route
											path="/preview"
											component={SearchPreview}
										/>
										{/* <Route
											path="/mappings"
											component={Mappings}
										/> */}
										<Route
											path="/query"
											component={QueryExplorer}
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
										visible={isShowingVideo}
										onCancel={this.hideVideoModal}
										width={610}
										footer={null}
									>
										<br />
										<iframe
											src="https://www.youtube.com/embed/qhDuRd2pJIY?rel=0&amp;showinfo=0"
											allow="autoplay; encrypted-media"
											width="560"
											height="315"
											frameBorder="0"
											title="video"
										/>
									</Modal>
								</div>
								<div>
									Create your <b>Elasticsearch</b> in cloud
									with{' '}
									<a
										href="https://appbase.io"
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
