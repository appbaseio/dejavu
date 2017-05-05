//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { Modal, Button } from 'react-bootstrap';

class DeleteQuery extends React.Component {
	state = {
		showModal: false,
		propShowModal: null
	};

	componentDidUpdate() {
		if (this.props.showModal !== this.state.propShowModal) {
			this.setState({
				showModal: this.props.showModal,
				propShowModal: this.props.showModal
			});
		}
	}

	close = () => {
		this.setState({
			showModal: false
		});
		this.props.deleteQueryCb(false);
	};

	open = () => {
		this.setState({
			showModal: true
		});
	};

	render() {
		return (
			<div className="inlineBlock pd-r10 pull-left ">
			<Modal className="modal-danger" show={this.state.showModal} onHide={this.close}>
			  <Modal.Header closeButton>
				<Modal.Title>Delete Query</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<p>You are about to delete the <strong>{this.props.selectedQuery.name}</strong> query.</p>
			  </Modal.Body>
			  <Modal.Footer>
				<Button bsStyle="danger" id="deleteBtn" className="loadingBtn"
				  onClick={this.props.deleteQuery}>
				  <span className="submitText">Confirm Deletion</span>
				  <i className="fa fa-spinner fa-spin"></i>
				</Button>
			  </Modal.Footer>
			</Modal>
		  </div>
		);
	}
}

module.exports = DeleteQuery;
