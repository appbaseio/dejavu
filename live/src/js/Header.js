import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import SandboxWrapper, { Wrapper } from './SandboxWrapper';
import MappingsWrapper from './MappingsWrapper';

const React = require('react');
const SubscribeModal = require('./SubscribeModal.js');

const Browser = () => null;

const Importer = () => (
	<Wrapper>
		<iframe src="https://importer.appbase.io" width="100%" height="100%" frameBorder="0" />
	</Wrapper>
);

class Header extends React.Component {
	render() {
		let subscribeModal;
		if (!((queryParams && queryParams.hasOwnProperty('subscribe')) || BRANCH === 'master')) {
			subscribeModal = (<SubscribeModal />);
		}
		return (
			<header className="header text-center">
				<div className="img-container">
					<a href={`/${window.location.hash}`} className="header-img-container">
						<img src="live/assets/img/Dejavu_Icon.svg" alt="Dejavu" className="img-responsive" />
						<span className="dejavu-title">
							dejavu
						</span>
						<span className="dejavu-subtitle">
							The missing web UI for Elasticsearch
						</span>
					</a>
					<Router>
						<span className="batteries-links">
							<NavLink
								isActive={(match, location) => location.pathname === '/importer'}
								className="link"
								activeClassName="active"
								to="/import"
							>
								Import
							</NavLink>
							<NavLink
								isActive={(match, location) => location.pathname === '/'}
								className="link"
								activeClassName="active"
								to={`/${window.location.hash}`}
							>
								Browser
							</NavLink>
							<NavLink
								isActive={(match, location) => location.pathname === '/sandbox'}
								className="link"
								activeClassName="active"
								to={`/sandbox${window.location.hash}`}
							>
								Search Sandbox
							</NavLink>
							<NavLink
								isActive={(match, location) => location.pathname === '/mappings'}
								className="link"
								activeClassName="active"
								to={`/mappings${window.location.hash}`}
							>
								Mappings
							</NavLink>

							<Route path="/" component={Browser} />
							<Route path="/import" component={Importer} />
							<Route path="/sandbox" component={SandboxWrapper} />
							<Route path="/mappings" component={MappingsWrapper} />
						</span>
					</Router>
				</div>
				{subscribeModal}
			</header>
		);
	}
}

module.exports = Header;
