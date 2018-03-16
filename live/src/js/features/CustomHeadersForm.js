import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

/* global feed, customHeaders, initWithHeaders */

class CustomHeadersForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: customHeaders || [{
				key: '',
				value: ''
			}]
		};
		this.add = this.add.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	add() {
		const { headers } = this.state;
		if (headers[headers.length - 1].key.trim() === '' || headers[headers.length - 1].value.trim() === '') {
			return;
		}
		this.setState({
			headers: headers.concat({
				key: '',
				value: ''
			})
		});
	}

	handleChange(e) {
		const { headers } = this.state;
		const { name, value } = e.target;
		const [key, index] = name.split('-');
		const insertObject = {
			...headers[index],
			[key]: value
		};
		const newHeaders = [
			...headers.slice(0, index),
			insertObject,
			...headers.slice(index + 1)
		];
		this.setState({
			headers: newHeaders
		});
	}

	handleSubmit() {
		const newHeaders = this.state.headers.filter(header => (
			header.key.trim() !== '' && header.value.trim() !== ''
		));
		if (newHeaders.length) {
			customHeaders = newHeaders;
			initWithHeaders();
			this.props.toggleShow();
		}
	}

	render() {
		return (
			<Modal show onHide={this.props.toggleShow}>
				<Modal.Header closeButton>
						<Modal.Title>Add Custom Headers</Modal.Title>
					</Modal.Header>
				<Modal.Body>
						<form className="form-horizontal" id="updateObjectForm">
							<div className="form-group">
								<div className="col-xs-6 mb-10">Key</div>
								<div className="col-xs-6 mb-10">Value</div>
								{
									this.state.headers.map((header, index) => (
										<div key={index}>
											<div className="col-xs-6 mt-10">
												<input type="text" onChange={this.handleChange} name={`key-${index}`} className="form-control" value={header.key} />
											</div>
											<div className="col-xs-6 mt-10">
												<input type="text" onChange={this.handleChange} name={`value-${index}`} className="form-control" value={header.value} />
											</div>
										</div>
									))
								}
								<Button className="btn-primary m-l15 mt-10" onClick={this.add}>Add</Button>
							</div>
						</form>
					</Modal.Body>
				<Modal.Footer>
			<Button className="btn-primary" onClick={this.handleSubmit}>Update</Button>
		  </Modal.Footer>
			</Modal>
		);
	}
}

CustomHeadersForm.propTypes = {
	toggleShow: PropTypes.func
};

export default CustomHeadersForm;
