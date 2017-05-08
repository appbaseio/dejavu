var React = require('react');
import { Modal } from 'react-bootstrap';

class Login extends React.Component {
	state = {
		showModal: this.props.showModal ? this.props.showModal : false
	};

	close = () => {
		this.setState({
			showModal: false
		}, function() {
			if(this.props.onClose) {
				this.props.onClose();
			}
		});
	};

	login = (provider) => {
		const baseURL = window.location.protocol+"//"+window.location.host+window.location.pathname;
		const redirectTo = "https://accapi.appbase.io/login/"+provider+"?next="+baseURL;
		localStorage.setItem("dejavuHash", window.location.hash);
		const importerValue = this.props.directImporter ? "directImporter" : "true";
		localStorage.setItem("importer", importerValue);
		window.location.href = redirectTo;
	};

	render() {
		return (
			<Modal className="modal-appbase modal-white" id="login_modal" show={this.state.showModal} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>
						Login with your Github or Google ID.
					</Modal.Title>
					<div className="bootstrap-dialog-close-button">
						<button className="close" onClick={this.close}>×</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div>
						<button className="btn Login-button modal-btn" onClick={this.login.bind(this, "github")} >Github</button>
						<button className="btn Login-button modal-btn" onClick={this.login.bind(this, "google")} >Google</button>
					</div>
					<div className="mt25">
						<p className="no-margin">
							Having issues logging in? Write to us&nbsp;
							<a className="contact-link" href="mailto:info@appbase.io?subject=Login+issues" rel="noopener noreferrer" target="_blank">here</a>.
						</p>
					</div>
				</Modal.Body>
			</Modal>
		);
	}
}

module.exports = Login;