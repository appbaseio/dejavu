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
		this.props.exportJsonData();
	};

	downloadFile = () => {
		var file = new File([this.props.dejavuExportData], "data.json", { type: "text/plain;charset=utf-8" });
		saveAs(file);
	};

	render() {
		return (<div className="pull-left">
					<a title="export" className="btn btn-default themeBtn m-r5 export-json-btn pull-left" onClick={this.open} >
					  <i className="fa fa-cloud-download"></i>
					</a>
					<Modal show={this.state.showModal} onHide={this.close}>
					  <Modal.Header closeButton>
						<Modal.Title>Export data <span className="small-span">in json</span></Modal.Title>
					  </Modal.Header>
					  <Modal.Body>
						<p className="json-spinner"> 
							<i className="fa fa-spinner fa-spin"></i>
							<span>&nbsp;Please wait, while we are loading</span>
						</p>
						{
							this.props.dejavuExportData ? (
								<a id="jsonlink"
									className="btn btn-success"
									onClick={this.downloadFile}>
									Download json
								</a>
							) : null
						}
					  </Modal.Body>
					</Modal>
				  </div>);
	}
}

module.exports = ImportData;
