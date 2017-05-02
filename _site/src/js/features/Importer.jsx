var React = require('react');
var Login = require('./Login.jsx');
var GoBackToDejavu = require('./GoBackToDejavu.jsx');

var Importer = React.createClass({
	getInitialState: function() {
		return {
			show: false,
			loggedIn: false
		};
	},
	componentWillMount: function() {
		this.checkLoggedIn();
	},
	componentDidMount: function() {
		this.handleLogout();
		if(this.props.directImporter) {
			this.open();
		}
	},
	handleLogout: function() {
		window.addEventListener("message", this.onLogout.bind(this), false);
	},
	onLogout: function(params) {
		setTimeout(function() {
			if(params.data === "loggedOut") {
				this.close();
			}
		}.bind(this), 1000);
	},
	checkLoggedIn: function(show) {
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
	},
	close: function() {
		$(".typeContainer").removeClass("importer-included");
		this.setState({
			show: false,
		});
		if(this.props.onClose) {
			this.props.onClose();
		}
	},
	open: function() {
		this.checkLoggedIn(true);
	},
	getImporterUrl: function() {
		return "https://appbaseio-confidential.github.io/importer";
	},
	render: function() {
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
							<iframe src={this.getImporterUrl()} frameBorder="0" className="dejavu-importer-iframe" />
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
});

module.exports = Importer;