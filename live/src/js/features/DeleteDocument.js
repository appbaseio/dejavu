//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { Modal, Button } from 'react-bootstrap';

class DeleteDocument extends React.Component {
	state = {
			showModal: false
	};

	componentDidUpdate() {}

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
				<div className="inlineBlock pd-r10 pull-left ">
					<a title="Delete" onClick={this.open} className="btn btn-default themeBtn">
						<i className="fa fa-trash greyBtn"></i>&nbsp;&nbsp;Delete
					</a>
					<Modal className="modal-danger" show={this.state.showModal} onHide={this.close}>
						<Modal.Header closeButton>
							<Modal.Title>Delete Data</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>You are about to <b>permanently</b> delete the selected data.</p>
						</Modal.Body>
						<Modal.Footer>
							<Button bsStyle="danger" id="deleteBtn" className="loadingBtn"
								onClick={this.props.actionOnRecord.deleteRecord}>
								<span className="submitText">Confirm Deletion</span>
								<i className="fa fa-spinner fa-spin"></i>
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
		);
	}
}

module.exports = DeleteDocument;