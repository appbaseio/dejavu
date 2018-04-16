var React = require('react');
var Login = require('./Login.js');
var GoBackToDejavu = require('./GoBackToDejavu.js');

class ImporterSidebar extends React.Component {
	open = () => {
		sessionStorage.setItem("dejavuUrl", window.location.href);
		let importFrom='';
		const scheme = (window.document.referrer.includes("dashboard")) ? "https://" : "http://";
		if (window.document.referrer.includes("dashboard")) {
			importFrom = `?app=${JSON.stringify({"platform":"appbase"})}`;
		}
		if(this.props.clone && this.props.appname) {
			let importerApp = {
				"importFrom": {
					appname: this.props.appname,
					hosturl: this.props.url
				},
				"platform": "appbase"
			};
			importFrom = `?app=${JSON.stringify(importerApp)}`;
			localStorage.setItem("importFrom", importFrom);
		}
		window.location.href = scheme + "importer.appbase.io" + importFrom
	};

	render() {
		return (
			<div className={"dejavu-importer "+ (this.props.clone ? " dejavu-importer-clone" : "dejavu-importer-direct")}>
				<button onClick={this.open} className="btn btn-primary dejavu-importer-btn">
					{ this.props.clone ? (
						<span>
							<i className="fa fa-clone"></i>&nbsp;&nbsp;Clone this app
						</span>
					) : "Import JSON or CSV files" }
				</button>
			</div>
		);
	}
}

module.exports = ImporterSidebar;
