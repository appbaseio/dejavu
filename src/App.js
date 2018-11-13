import React, { Component } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Dejavu from './components/Dejavu';
import Importer from './components/Importer';
import SearchPreview from './components/SearchPreview';
import Mappings from './components/Mappings';
import Navigation from './components/Navigation';
import NoMatch from './components/NoMatch';

import configureStore from './store';
import {
	getUrlParams,
	getLocalStorageItem,
	setLocalStorageData,
} from './utils';
import { LOCAL_CONNECTIONS } from './constants';

import logo from './images/dejavu-logo.svg';

const { Content, Sider } = Layout;
const store = configureStore();

class App extends Component {
	state = {
		isShowingSideBar: true,
	};

	componentDidMount() {
		const { sidebar } = getUrlParams(window.location.search);

		if (sidebar && sidebar === 'false') {
			this.setSideBarVisibility(false);
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

	render() {
		const { isShowingSideBar } = this.state;
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Layout
						css={{ minHeight: isShowingSideBar ? '100vh' : 'auto' }}
					>
						{isShowingSideBar && (
							<Sider theme="light">
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
							<Content
								css={{ margin: isShowingSideBar ? 25 : 0 }}
							>
								<div
									css={{
										padding: 25,
										background: '#fff',
										paddingBottom: 60,
									}}
								>
									<Switch>
										<Route
											exact
											path="/"
											component={Dejavu}
										/>
										<Route
											path="/import"
											component={Importer}
										/>
										<Route
											path="/preview"
											component={SearchPreview}
										/>
										<Route
											path="/mappings"
											component={Mappings}
										/>
										<Route component={NoMatch} />
									</Switch>
								</div>
							</Content>
						</Layout>
					</Layout>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
