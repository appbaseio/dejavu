import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

var Utils = require('../helper/utils.js');

class AddQuery extends React.Component {
	state = {
		showModal: false,
		validate: {
			touch: false,
			name: false,
			type: false,
			body: false
		},
		name: this.props.editable ? this.props.queryInfo.name : ''
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
			data: typeList
		});
		$eventSelect.on("change", function(e) {
			var validateClass = $this.state.validate;
			validateClass.type = true;
			$this.setState({
				validate: validateClass
			});
		});
	};

	getType = () => {
		const allTypes = this.props.editable ?
			[...new Set(this.props.types.concat(this.props.queryInfo.type))] :
			this.props.types;
		const typeList = allTypes.map(function(type) {
			return {
				id: type,
				text: type
			};
		});
		return typeList;
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}

	close = () => {
		this.setState({
			error: null
		});
		Utils.closeModal.call(this);
	};

	open = () => {
		Utils.openModal.call(this);
		setTimeout(() => {
			if (this.props.editable) {
				$('#applyQueryOn').val(this.props.queryInfo.type).change();
			}
		}, 300);
	};

	validateInput = () => {
		var validateClass = this.state.validate;
		var queryValues = {
			name: document.getElementById('setName').value,
			query: this.editorref.getValue(),
			createdAt: new Date().getTime(),
			type: document.getElementById('applyQueryOn').value
		};
		validateClass.touch = true;
		validateClass.name = queryValues.name == '' ? false : true;
		validateClass.body = this.IsJsonString(queryValues.query);
		validateClass.type = queryValues.type == '' ? false : true;
		this.setState({
			validate: validateClass
		});
		if (validateClass.name && validateClass.body && validateClass.type) {
			queryValues.type = $('#applyQueryOn').val();
			this.validateQuery(queryValues);
			// this.props.includeQuery(queryValues);
			// this.close();
		}
	};

	validateQuery = (queryValues) => {
		$('.applyQueryBtn').addClass('loading');
		$('.applyQueryBtn').attr('disabled', true);
		var self = this;
		var testQuery = feed.testQuery(queryValues.type, JSON.parse(queryValues.query));
		testQuery.on('data', function(res) {
			if (!res.hasOwnProperty('error')) {
				$('.applyQueryBtn').removeClass('loading').removeAttr('disabled');
				self.props.includeQuery(queryValues, self.props.queryIndex);
				self.close();
			} else {
				$('.applyQueryBtn').removeClass('loading').removeAttr('disabled');
				self.setState({
					error: res.error
				});
			}
		}).on('error', function(err) {
			self.setState({
				error: err
			});
			$('.applyQueryBtn').removeClass('loading').removeAttr('disabled');
		});
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
		// this.props.userTouchAdd(flag);
	};

	hideError = () => {
		this.setState({
			error: null
		});
	};

	isErrorExists = () => {
		var errorText;
		if(this.state.error) {
			var error = this.state.error;
			try {
				error = JSON.stringify(this.state.error);
			} catch(e) {}
			errorText = (
				<div key={Math.random()} className="query-error alert alert-danger alert-dismissible" role="alert">
					<button type="button" className="close" onClick={this.hideError}><span aria-hidden="true">&times;</span></button>
					{error}
				</div>
			);
		}
		return errorText;
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
			validateClass.name = this.state.validate.name ? 'form-group' : 'form-group has-error';
			validateClass.type = this.state.validate.type ? 'form-group' : 'form-group has-error';
		} else {
			var validateClass = {
				name: 'form-group',
				body: 'form-group',
				type: 'form-group'
			};
		}
		var selectClass = this.props.selectClass + ' tags-select form-control';

		return (
			<div className={`add-record-container ${this.props.editable ? 'edit-query-container col-xs-5' : 'col-xs-12'} pd-0`}>
				<a href="javascript:void(0);" className="add-record-btn btn btn-primary col-xs-12" title={this.props.editable ? 'Edit' : 'Add'} onClick={this.open} >
					{
						this.props.editable ?
							<span>Edit Query</span> :
							<span><i className="fa fa-plus pad-right" />Add Query</span>
					}
				</a>
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>
							{
								this.props.editable ?
									'Update' :
									'Add'
							}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form className="form-horizontal" id="addObjectForm">
							<div className={validateClass.name}>
								<label htmlFor="inputEmail3" className="col-sm-3 control-label">Name</label>
								<div className="col-sm-9">
									<input type="text" className="form-control" id="setName" placeholder="Query name" name="name" value={this.state.name} onChange={this.handleChange} />
									<span className="help-block">
										Query name is required.
									</span>
								</div>
							</div>
							{Utils.getTypeMarkup('query', validateClass, selectClass)}
							{
								this.props.editable ?
									Utils.getBodyMarkup('query', validateClass, selectClass, this.userTouch, this.props.queryInfo.query) :
									Utils.getBodyMarkup('query', validateClass, selectClass, this.userTouch)
							}
						</form>
					</Modal.Body>
					<Modal.Footer>
						<div>
							{this.isErrorExists()}
						</div>
						<Button key="applyQueryBtn" className="applyQueryBtn" bsStyle="success" onClick={this.validateInput}>
							<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
							{
								this.props.editable ?
									'Update' :
									'Add'
							}
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

AddQuery.defaultProps = {
	queryIndex: null
};

AddQuery.propTypes = {
	editable: PropTypes.bool,
	queryInfo: PropTypes.object	// eslint-disable-line
};

module.exports = AddQuery;
