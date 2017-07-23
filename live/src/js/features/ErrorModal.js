// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");

import { Modal } from "react-bootstrap";

class ErrorModal extends React.Component {
	state = {
		showModal: false
	};

	componentDidUpdate() {}

	close = () => {
		this.props.closeErrorModal();
	};

	render() {
		const errorShow = this.props.errorShow;
		return (<div>
			<Modal className="modal-danger" show={errorShow} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>Authentication Error</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>It looks like your app name, username, password combination doesn't match.
						Check your url and appname and then connect it again.</p>
				</Modal.Body>
			</Modal>
		</div>);
	}
}

module.exports = ErrorModal;
