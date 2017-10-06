import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

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
		return (
			<div>
				<Modal className="modal-danger" show={errorShow} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.errorTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>{this.props.errorMessage}</p>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

ErrorModal.propTypes = {
	errorShow: PropTypes.bool.isRequired,
	closeErrorModal: PropTypes.func.isRequired,
	errorMessage: PropTypes.string
};

ErrorModal.defaultProps = {
	errorTitle: 'Authentication Error',
	errorMessage: "It looks like your app name, username, password combination doesn't match. Check your url and appname and then connect it again."	// eslint-disable-line
};

module.exports = ErrorModal;
