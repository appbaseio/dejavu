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
		}, () => {
			$('.modal-text').hide();
		});
		this.props.exportJsonData();
	};

	downloadJSON = () => {
		var file = new File([this.props.dejavuExportData], "data.json", { type: "application/json;charset=utf-8" });
		saveAs(file);
	};

	downloadCSV = () => {
		try {
			let exportData = JSON.parse(this.props.dejavuExportData);
			exportData = exportData.map(item => {
				item = Object.assign(item, item._source);
				delete item._source;
				return this.flatten(item)
			});
			const newData = Papa.unparse(exportData, config);
			const file = new File([newData], "data.csv", { type: "text/comma-separated-values;charset=utf-8" });
			saveAs(file);
		} catch(e) {
			console.log(e);
		}
	};

	flatten = (data) => {
		var result = {};
		function recurse (cur, prop) {
			if (Object(cur) !== cur) {
				result[prop] = cur;
			} else if (Array.isArray(cur)) {
				for(var i=0, l=cur.length; i<l; i++)
					recurse(cur[i], prop + "[" + i + "]");
				if (l == 0)
					result[prop] = [];
			} else {
				var isEmpty = true;
				for (var p in cur) {
					isEmpty = false;
					recurse(cur[p], prop ? prop+"."+p : p);
				}
				if (isEmpty && prop)
					result[prop] = {};
			}
		}
		recurse(data, "");
		return result;
	}

	render() {
		return (<div className="pull-left">
					<a title="export" className="btn btn-default themeBtn m-r5 export-json-btn pull-left" onClick={this.open} >
					  <i className="fa fa-cloud-download"></i>
					  &nbsp;Export
					</a>
					<Modal show={this.state.showModal} onHide={this.close}>
					  <Modal.Header closeButton>
						<Modal.Title>Export Data <span className="small-span"></span></Modal.Title>
					  </Modal.Header>
					  <Modal.Body>
						<p className="json-spinner">
							<i className="fa fa-spinner fa-spin"></i>
							<span>&nbsp;We are fetching the result data, please wait...</span>
						</p>
						<p className="modal-text">
							Download the result data as a JSON or CSV file.
						</p>
						{
							this.props.dejavuExportData ? (
								<div>
									<a id="jsonlink"
										className="btn btn-success m-r10"
										onClick={this.downloadJSON}>
										Download as JSON
									</a>
									<a id="csvlink"
										className="btn btn-success"
										onClick={this.downloadCSV}>
										Download as CSV
									</a>
								</div>
							) : null
						}
					  </Modal.Body>
					</Modal>
				  </div>);
	}
}

module.exports = ImportData;
