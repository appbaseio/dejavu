var React = require('react');
var Login = require('./Login.js');
var GoBackToDejavu = require('./GoBackToDejavu.js');

class ImporterSidebar extends React.Component {
	open = () => {
		sessionStorage.setItem("dejavuUrl", window.location.href);
		window.location.href = "./importer/index.html"
	};

	render() {
		return (
			<div className="dejavu-importer">
				<button onClick={this.open} className="btn btn-primary dejavu-importer-btn">
					Import JSON or CSV files
				</button>
			</div>
		);
	}
}

module.exports = ImporterSidebar;