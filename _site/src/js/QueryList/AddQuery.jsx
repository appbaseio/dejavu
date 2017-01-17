var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var ReactBootstrap = require('react-bootstrap');

var AddQuery = React.createClass({

	getInitialState: function() {
		return {
			showModal: false,
			validate: {
				touch: false,
				name: false,
				body: false

			}
		};
	},
	componentDidUpdate: function() {},
	close: function() {
		this.setState({
			showModal: false,
			validate: {
				touch: false,
				name: false,
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
	validateInput: function() {
		var validateClass = this.state.validate;
		var queryValues = {
			name: document.getElementById('setName').value,
			query: this.editorref.getValue(),
			createdAt: new Date().getTime()
		};
		validateClass.touch = true;
		validateClass.name = queryValues.name == '' ? false : true;
		validateClass.body = this.IsJsonString(queryValues.query);
		this.setState({
			validate: validateClass
		});
		if (validateClass.name && validateClass.body) {
			this.props.includeQuery(queryValues);
			this.close();
		}
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
		// this.props.userTouchAdd(flag);
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
			validateClass.name = this.state.validate.name ? 'form-group' : 'form-group has-error';
		} else {
			var validateClass = {
				name: 'form-group',
				body: 'form-group'
			};
		}
		var btnLinkClassSub = this.props.link == "true" ? 'add-record-link fa fa-plus' : 'add-record-btn btn btn-primary fa fa-plus';
		var selectClass = this.props.selectClass + ' tags-select form-control';

		return (
			<div className="add-record-container">
				<a href="javascript:void(0);" className={btnLinkClassSub}  title="Add" onClick={this.open} >{btnText}</a>
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Add Query</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form className="form-horizontal" id="addObjectForm">
						<div className={validateClass.name}>
							<label for="inputEmail3" className="col-sm-3 control-label">Name <span className="small-span">(aka table)</span></label>
							<div className="col-sm-9">
								<input type="text" className="form-control" id="setName" placeholder="Query name" name="name" />
								<span className="help-block">
									Query name is required.
								</span>
							</div>
						</div>
						<div className={validateClass.body}>
							<label for="inputPassword3" className="col-sm-3 control-label">JSON</label>
							<div className="col-sm-9">
								<textarea id="setBody" className="form-control" rows="10" name="body"
									onClick={this.userTouch.bind(null, true)}
									onFocus={this.userTouch.bind(null, true)} ></textarea>
								<span className="help-block">
									Elasticsearch Query is required.
								</span>
							</div>
						</div>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="success" onClick={this.validateInput}>Apply</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
});

module.exports = AddQuery;
