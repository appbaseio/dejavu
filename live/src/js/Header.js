import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import SandboxWrapper from './SandboxWrapper';
import MappingsWrapper from './MappingsWrapper';

const React = require('react');
const SubscribeModal = require('./SubscribeModal.js');

const Browser = () => null;

class Header extends React.Component {
	render() {
		let subscribeModal;
		if (!((queryParams && queryParams.hasOwnProperty('subscribe')) || BRANCH === 'master')) {
			subscribeModal = (<SubscribeModal />);
		}
		return (
			<header className="header text-center">
				<div className="img-container">
					<span className="header-img-container">
						<img src="live/assets/img/Dejavu_Icon.svg" alt="Dejavu" className="img-responsive" />
						<span className="dejavu-title">
							dejavu
						</span>
						<span className="dejavu-subtitle">
							The missing web UI for Elasticsearch
						</span>
					</span>
					<Router>
						<span className="batteries-links">
							<Link className="link" to={`/${window.location.hash}`}>Browser</Link>
							<Link className="link" to={`/sandbox${window.location.hash}`}>Search Sandbox</Link>
							<Link className="link" to={`/mappings${window.location.hash}`}>Mappings</Link>

							<Route path="/" component={Browser} />
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
