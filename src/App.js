import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route } from 'react-router-dom';

import DataBrowser from './components/DataBrowser';
import Importer from './components/Importer';
import SearchPreview from './components/SearchPreview';
import Mappings from './components/Mappings';
import Navigation from './components/Navigation';

import logo from './images/dejavu-logo.svg';

const { Content, Sider } = Layout;

const App = () => (
	<BrowserRouter>
		<Layout css={{ minHeight: '100vh' }}>
			<Sider theme="light">
				<img
					src={logo}
					alt="Dejavu"
					width="100%"
					css={{ padding: 25 }}
				/>
				<Navigation />
			</Sider>
			<Layout>
				<Content css={{ margin: 25 }}>
					<div
						css={{
							padding: 25,
							background: '#fff',
						}}
					>
						<Route exact path="/" component={DataBrowser} />
						<Route path="/import" component={Importer} />
						<Route path="/preview" component={SearchPreview} />
						<Route path="/mappings" component={Mappings} />
					</div>
				</Content>
			</Layout>
		</Layout>
	</BrowserRouter>
);

export default App;
