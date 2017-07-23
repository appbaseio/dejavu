//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { Modal, Button } from 'react-bootstrap';

class ImportData extends React.Component {
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
			<div>
				<a title="Import" onClick={this.open} >
					<img src="src/img/import.png" /> Import <span className="small-span">from JSON, MongoDB</span>
				</a>
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Import Data into Appbase <span className="small-span">from JSON, MongoDB</span></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Use appbase.io's <a href="https://github.com/appbaseio/transporter" target="_new">transporter <span className="fa fa-external-link"></span></a> fork to import data from
						MongoDB, any JSON structure, or text file in three simple steps:
						</p>
						<ol>
						  <li>Get the latest release for your system from
							<a href="https://github.com/appbaseio/transporter/releases/tag/v0.1.2-appbase" target="_new"> here <span className="fa fa-external-link"></span></a>.</li>
						  <li>Set the source and sink configurations as mentioned
						  in the file here, and save it in the same folder as config.yml.</li>
						<li>Run the transporter using ./transporter run --config &lt;config_file&gt; &lt;transform_file&gt;</li>
						</ol>
						<p>Or shoot us at info@appbase.io or intercom if you want us to help with importing data.</p>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

module.exports = ImportData;
