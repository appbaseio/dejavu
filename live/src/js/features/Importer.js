const React = require("react");
const Login = require("./Login.js");
const GoBackToDejavu = require("./GoBackToDejavu.js");
// const importerURL = "http://127.0.0.1:1357/";
const importerURL = "https://appbaseio-confidential.github.io/importer/";

class Importer extends React.Component {
	state = {
		show: true,
		loggedIn: null,
		importerURL: null
	};

	componentDidMount() {
		this.handleLogout();
		this.open();
	}

	handleLogout = () => {
		window.addEventListener("message", this.onLogout.bind(this), false);
	};

	onLogout = (params) => {
		setTimeout(() => {
			if (params.data === "loggedOut") {
				this.close();
			}
		}, 1000);
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
		$.get(`${this.address}user`)
			.done((data) => {
				this.userInfo = data;
				this.setState({
					loggedIn: true,
					importerURL: this.getImporterURL()
				}, () => {
					$(".typeContainer").addClass("importer-included");
				});
			}).fail((e) => {
				console.log(e);
				this.setState({
					loggedIn: false,
					show: true
				});
			});
	};

	close = () => {
		$(".typeContainer").removeClass("importer-included");
		this.setState({
			show: false
		});
		if (this.props.onClose) {
			this.props.onClose();
		}
	};

	open = () => {
		this.checkLoggedIn(true);
	};

	getImporterURL = () => {
		const importerFrom = localStorage.getItem("importFrom");
		localStorage.removeItem("importFrom");
		return importerFrom ? importerURL + importerFrom : importerURL;
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
					this.state.show && this.state.loggedIn && this.state.importerURL ? (
						<div className="dejavu-importer-iframe-container">
							<iframe src={this.state.importerURL} frameBorder="0" className="dejavu-importer-iframe" />
							<GoBackToDejavu onConfirm={this.close} />
						</div>
					) : null
				}
				{
					this.state.show && this.state.loggedIn === false ? (
						<Login directImporter={this.props.directImporter} onClose={this.props.onClose} showModal={true} />
					) : null
				}
			</div>
		);
	}
}

module.exports = Importer;
