//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { Modal, Button } from 'react-bootstrap';
var Utils = require('../helper/utils.js');

class AddDocument extends React.Component {
	state = {
		showModal: false,
		validate: {
			touch: false,
			type: false,
			body: false
		}
	};

	componentDidUpdate() {
		Utils.applySelect.call(this);
	}

	applySelect = (ele) => {
		var $this = this;
		var $eventSelect = $("." + this.props.selectClass);
		var typeList = this.getType();
		$eventSelect.select2({
			tags: true,
			maximumSelectionLength: 1,
			data: typeList
		});
		$eventSelect.on("change", function(e) {
			var validateClass = $this.state.validate;
			validateClass.type = true;
			$this.setState({
				validate: validateClass
			});
			$this.props.getTypeDoc($this.editorref);
		});
	};

	close = () => {
		this.setState({
			showModal: false,
			validate: {
				touch: false,
				type: false,
				body: false
			},
			selectClass: ''
		});
	};

	open = () => {
		Utils.openModal.call(this);
	};

	getType = () => {
		var typeList = this.props.types.map(function(type) {
			return {
				id: type,
				text: type
			};
		});
		return typeList;
	};

	validateInput = () => {
		var validateClass = this.state.validate;
		validateClass.touch = true;
		validateClass.type = document.getElementById('setType').value == '' ? false : true;
		validateClass.body = this.IsJsonString(this.editorref.getValue());
		this.setState({
			validate: validateClass
		});
		if (validateClass.type && validateClass.body)
			this.props.addRecord(this.editorref);
	};

	IsJsonString = (str) => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	};

	userTouch = (flag) => {
		this.props.userTouchAdd(flag);
	};

	render() {
		var typeList = '';
		var btnText = this.props.text ? this.props.text : '';
		if (typeof this.props.types != 'undefined') {
			typeList = this.props.types.map(function(type) {
				return <option value={type}>{type}</option>
			});
		}
		if (this.state.validate.touch) {
			var validateClass = {};
			validateClass.body = this.state.validate.body ? 'form-group' : 'form-group has-error';
			validateClass.type = this.state.validate.type ? 'form-group' : 'form-group has-error';
		} else {
			var validateClass = {
				type: 'form-group',
				body: 'form-group'
			};
		}
		var btnLinkClassSub = this.props.link == "true" ? 'add-record-link' : 'add-record-btn btn btn-primary';
		var selectClass = this.props.selectClass + ' tags-select form-control';

		return (<div className="add-record-container pd-r10">
			<a href="javascript:void(0);" className={btnLinkClassSub}  title="Add" onClick={this.open} ><i className=" fa fa-plus"></i>
				{
					btnText &&
					<span className="add-data-text">{btnText}</span>
				}
			</a>
					<Modal show={this.state.showModal} onHide={this.close}>
					  <Modal.Header closeButton>
						<Modal.Title>Add Data</Modal.Title>
					  </Modal.Header>
					  <Modal.Body>
						<form className="form-horizontal" id="addObjectForm">
							{Utils.getTypeMarkup('document', validateClass, selectClass)}
							<div className="form-group">
								<label htmlFor="inputPassword3" className="col-sm-3 control-label">Document Id</label>
								<div className="col-sm-9">
								  <input type="text" className="form-control" id="setId" placeholder="set Id" name="id" />
								</div>
							</div>
							{Utils.getBodyMarkup('document', validateClass, selectClass, this.userTouch)}
						</form>
					  </Modal.Body>
					  <Modal.Footer>
						<Button bsStyle="success" onClick={this.validateInput}>Add</Button>
					  </Modal.Footer>
					</Modal>
				  </div>);
	}
}

module.exports = AddDocument;
