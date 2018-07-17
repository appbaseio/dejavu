var React = require('react');
var SubscribeModal = require('./SubscribeModal.js');

class Header extends React.Component {
	render() {
		var subscribeModal;
		if(!((queryParams && queryParams.hasOwnProperty('subscribe')) || BRANCH === 'master')) {
			subscribeModal = (<SubscribeModal></SubscribeModal>);
		}
		return (
			<header className="header text-center">
				<div className="img-container">
					<span className="header-img-container">
						<img src="live/assets/img/Dejavu_Icon.svg" alt="Dejavu" className="img-responsive"/>
						<span className="dejavu-title">
							dejavu
						</span>
						<span className="dejavu-subtitle">
							The missing web UI for Elasticsearch
						</span>
					</span>
				</div>
				{subscribeModal}
			</header>
		);
	}
}

module.exports = Header;
