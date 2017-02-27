//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

var AddDocument = React.createClass({

	getInitialState: function() {
		return {
			showModal: false,
			validate: {
				touch: false,
				type: false,
				body: false
			}
		};
	},
	componentDidUpdate: function() {
		//apply select2 for auto complete
		if (!this.state.validate.type && typeof this.props.types != 'undefined' && typeof this.props.selectClass != 'undefined')
			this.applySelect();
	},
	applySelect: function(ele) {
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
	},
	close: function() {
		this.setState({
			showModal: false,
			validate: {
				touch: false,
				type: false,
				body: false
			},
			selectClass: ''
		});
	},
	open: function() {
		this.userTouch(false);
		this.setState({
			showModal: true
		});
		setTimeout(function() {
			this.editorref = help.setCodeMirror('setBody');
		}.bind(this), 300);
	},
	getType: function() {
		var typeList = this.props.types.map(function(type) {
			return {
				id: type,
				text: type
			};
		});
		return typeList;
	},
	validateInput: function() {
		var validateClass = this.state.validate;
		validateClass.touch = true;
		validateClass.type = document.getElementById('setType').value == '' ? false : true;
		validateClass.body = this.IsJsonString(this.editorref.getValue());
		this.setState({
			validate: validateClass
		});
		if (validateClass.type && validateClass.body)
			this.props.addRecord(this.editorref);
	},
	IsJsonString: function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	},
	userTouch: function(flag) {
		this.props.userTouchAdd(flag);
	},
	render: function() {
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
		var btnLinkClassSub = this.props.link == "true" ? 'add-record-link fa fa-plus' : 'add-record-btn btn btn-primary fa fa-plus';
		var selectClass = this.props.selectClass + ' tags-select form-control';

		return (<div className="add-record-container pd-r10">
					<a href="javascript:void(0);" className={btnLinkClassSub}  title="Add" onClick={this.open} >{btnText}</a>
					<Modal show={this.state.showModal} onHide={this.close}>
					  <Modal.Header closeButton>
						<Modal.Title>Add Data</Modal.Title>
					  </Modal.Header>
					  <Modal.Body>
						<form className="form-horizontal" id="addObjectForm">
						  <div className={validateClass.type}>
							<label for="inputEmail3" className="col-sm-3 control-label">Type <span className="small-span">(aka table)</span></label>
							<div className="col-sm-9">
							  <select id="setType" className={selectClass} multiple="multiple" name="type">
							  </select>
								<span className="help-block">
								  Type in which the data will be stored.
								</span>
							</div>
						  </div>
						  <div className="form-group">
							<label for="inputPassword3" className="col-sm-3 control-label">Document Id</label>
							<div className="col-sm-9">
							  <input type="text" className="form-control" id="setId" placeholder="set Id" name="id" />
							</div>
						  </div>
						  <div className={validateClass.body}>
							<label for="inputPassword3" className="col-sm-3 control-label">
								JSON
								<p className="small-span">
									(use array for adding multiple records, <a href="#">see an example</a>.)
								</p>
							</label>
							<div className="col-sm-9">
							  <textarea id="setBody" className="form-control" rows="10" name="body"
								onClick={this.userTouch.bind(null, true)}
								onFocus={this.userTouch.bind(null, true)} ></textarea>
							   <span className="help-block">
								  A data document is stored as a JSON object.
								</span>
							</div>
						  </div>
						</form>
					  </Modal.Body>
					  <Modal.Footer>
						<Button bsStyle="success" onClick={this.validateInput}>Add</Button>
					  </Modal.Footer>
					</Modal>
				  </div>);
	}
});

module.exports = AddDocument;
