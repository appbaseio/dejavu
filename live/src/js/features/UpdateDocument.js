//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { Modal, Button } from 'react-bootstrap';

//Update Document
class UpdateDocument extends React.Component {
	state = {
		showModal: false,
		validate: {
			touch: false,
			type: false,
			body: false
		}
	};

	componentDidUpdate() {

	}

	close = () => {
		this.setState({
			showModal: false,
			validate: {
				touch: false,
				body: false
			},
			selectClass: ''
		});
	};

	open = () => {
		this.setState({
			showModal: true
		});
		setTimeout(function() {
			this.editorref = help.setCodeMirror('setBodyUpdate');
		}.bind(this), 300);
		if (!this.props.currentCell) {
			this.props.actionOnRecord.getUpdateObj();
		}
	};

	validateInputCheck = () => {
		var validateClass = this.state.validate;
		validateClass.touch = true;
		validateClass.body = this.IsJsonString(this.editorref.getValue());
		this.setState({
			validate: validateClass
		});
		if (validateClass.body) {
			this.props.actionOnRecord.updateRecord(this.editorref, this.props.columnName);
		}
	};

	IsJsonString = (str) => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	};

	render() {
		var typeList = '';
		var actionOnRecord = this.props.actionOnRecord;
		if (this.state.validate.touch) {
			var validateClass = {};
			validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error';
		} else {
			var validateClass = {
				type: 'form-group',
				body: 'form-group'
			};
		}

		return (
			<div className="inlineBlock pd-r10 pull-left">
				<a href="javascript:void(0);" className='btn btn-default themeBtn'  title="Update" onClick={this.open} >
					<i className="fa fa-pencil greyBtn"></i>&nbsp;&nbsp;Update
				</a>
				<Modal className="modal-warning" show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Update Data</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form className="form-horizontal" id="updateObjectForm">
							<div className="form-group">
								<label htmlFor="inputEmail3" className="col-sm-3 control-label">Type <span className="small-span">(aka Table)</span></label>
								<div className="col-sm-9">
									<input type="text" className="form-control" id="type" name="type" value={actionOnRecord.type} readOnly />
								</div>
							</div>
							<div className="form-group">
								<label htmlFor="inputPassword3" className="col-sm-3 control-label">Document Id</label>
								<div className="col-sm-9">
									<input type="text" className="form-control" id="setId"
										value={actionOnRecord.id} readOnly placeholder="set Id" name="id" />
								</div>
							</div>
							<div className={validateClass.body}>
								<label htmlFor="inputPassword3" className="col-sm-3 control-label">JSON <span className="small-span">(partial object)</span></label>
								<div className="col-sm-9">
									<textarea id="setBodyUpdate" className="form-control" rows="10" name="body" defaultValue={actionOnRecord.row}></textarea>
									<span className="help-block">
					  Body is required and should be valid JSON.
					</span>
				</div>
			  </div>
			</form>
		  </Modal.Body>
		  <Modal.Footer>
			<Button bsStyle="warning" onClick={this.validateInputCheck}>Update</Button>
		  </Modal.Footer>
		</Modal>
	  </div>
		);
	}
}

UpdateDocument.defaultProps = {
	currentCell: false,
	columnName: null
};

module.exports = UpdateDocument;
