import React from 'react';

class CustomHeadersForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isValid: true
		};
		this.isValidJson = this.isValidJson.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.editorref = help.setCodeMirror('custom-headers-textarea');
		if (customHeaders) {
			this.editorref.setValue(JSON.stringify(customHeaders));
		}
	}

	isValidJson(json) {
		try {
			JSON.parse(json);
		} catch (e) {
			return false;
		}
		return true;
	}

	handleSubmit() {
		const headersObj = this.editorref.getValue().trim();
		if (this.isValidJson(headersObj)) {
			customHeaders = JSON.parse(headersObj);
			setTimeout(() => {
				initWithHeaders();
				document.body.click();	// hack for react-bootstrap overlay
			}, 1500);
		} else {
			this.setState({
				isValid: false
			});
		}
	}

	render() {
		return (
			<div className="custom-headers-form">
				<textarea id="custom-headers-textarea" rows="7" />
				{
					!this.state.isValid &&
					<div>
						<span className="alert-message">Headers object should be a valid JSON</span>
					</div>
				}
				<button className="btn btn-primary custom-headers-submit" onClick={this.handleSubmit}>
					Update
				</button>
			</div>
		);
	}
}

export default CustomHeadersForm;
