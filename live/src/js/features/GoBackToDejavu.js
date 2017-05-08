var React = require('react');
import { Modal, Button } from 'react-bootstrap';

class GoBackToDejavu extends React.Component {
	state = {
		showModal: false
	};

	close = () => {
		this.setState({
			showModal: false
		});
	};

	open = () => {
		this.setState({
			showModal: true
		});
	};

	render() {
		return (
			<div>
				<a title="back" onClick={this.open} className="btn theme-btn-danger dejavu-importer-close">
					Switch to Data View
				</a>
				<Modal className="modal-danger" show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>
							Switch to Data View
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p> Do you want to abort the import process and go back to the data view? The current progress will not be saved.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="danger"
							onClick={this.props.onConfirm}>
							Confirm
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

module.exports = GoBackToDejavu;
