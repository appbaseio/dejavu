var React = require('react');
var Login = require('./Login.js');
var GoBackToDejavu = require('./GoBackToDejavu.js');
// const importerURL = "http://127.0.0.1:1357/";
const importerURL = "https://appbaseio-confidential.github.io/importer/";

class Importer extends React.Component {
	state = {
		show: false,
		loggedIn: false
	};

	componentWillMount() {
		this.checkLoggedIn();
	}

	componentDidMount() {
		this.handleLogout();
		if(this.props.directImporter) {
			this.open();
		}
	}

	handleLogout = () => {
		window.addEventListener("message", this.onLogout.bind(this), false);
	};

	onLogout = (params) => {
		setTimeout(function() {
			if(params.data === "loggedOut") {
				this.close();
			}
		}.bind(this), 1000);
	};

	checkLoggedIn = (show) => {
		this.userInfo = null;
		this.apps = {};
		this.address = "https://accapi.appbase.io/";
		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});
		$.get(this.address+"user")
			.done(function(data) {
				this.userInfo = data;
				var storageImporter = localStorage.getItem("importer");
				var showFlag = show ? show : (storageImporter && storageImporter === "true" ? true : false);
				this.setState({
					loggedIn: true,
					show: showFlag
				}, function() {
					if(showFlag) {
						$(".typeContainer").addClass("importer-included");
						localStorage.setItem("importer", "false");
					}
				});
			}.bind(this)).fail(function(e) {
				console.log(e);
				if(show) {
					this.setState({
						loggedIn: false,
						show: true
					});
				}
			}.bind(this));
	};

	close = () => {
		$(".typeContainer").removeClass("importer-included");
		this.setState({
			show: false,
		});
		if(this.props.onClose) {
			this.props.onClose();
		}
	};

	open = () => {
		this.checkLoggedIn(true);
	};

	getImporterURL = () => {
		const importerFrom = sessionStorage.getItem("importFrom");
		sessionStorage.removeItem("importFrom");
		return importerFrom ? importerURL+importerFrom : importerURL;
	};

	render() {
		return (
			<div className="dejavu-importer">
				{
					this.props.directImporter ? null : (
						<button onClick={this.open} className="btn btn-primary dejavu-importer-btn">
							Import JSON or CSV files
						</button>
					)
				}
				{
					this.state.show && this.state.loggedIn ? (
						<div className="dejavu-importer-iframe-container">
							<iframe src={this.getImporterURL()} frameBorder="0" className="dejavu-importer-iframe" />
							<GoBackToDejavu onConfirm={this.close} />
						</div>
					) : null
				}
				{
					this.state.show && !this.state.loggedIn ? (
						<Login directImporter={this.props.directImporter} onClose={this.props.onClose} showModal={true}></Login>
					) : null
				}
			</div>
		);
	}
}

module.exports = Importer;