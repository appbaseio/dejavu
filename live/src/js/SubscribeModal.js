// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");

import { Modal, Button } from "react-bootstrap";

const authService = require("./authService/authOperation.js");

const authOperation = authService.authOperation;
const authEmitter = authService.authEmitter;

class SubscribeModal extends React.Component {
	state = {
		showModal: false,
		profile: false,
		subscribeOption: "major"
	};

	componentWillMount() {
		this.options = {
			option1: {
				value: "major",
				text: "New Dejavu releases"
			},
			option2: {
				value: "all",
				text: "Limited major updates"
			}
		};
		this.countdown = 0;
		this.timer = 1;
		this.activetab = true;
		this.holdSubscribe = false;
		this.internalClose = false;
		this.init();
	}

	init = () => {
		authEmitter.addListener("profile", (data) => {
			this.setState({
				profile: data
			});
		});
		storageService.set("dejavuPopuptimerAlreadyOpen", "no");
		var popupInterval = setInterval(() => {
			this.countdown++;
			if (!this.state.profile) {
				const subPopuptimer = storageService.get("dejavuPopuptimer");
				if (subPopuptimer && subPopuptimer !== "NaN") {
					this.timer = parseInt(storageService.get("dejavuPopuptimer"), 10);
				}
				if (this.countdown === this.timer) {
					this.open();
				}
			} else {
				popupInterval();
			}
		}, 1000 * 60);
		$(window).focus(() => {
			this.activetab = true;
			setTimeout(() => {
				if (!this.state.profile && this.holdSubscribe && !this.internalClose) {
					this.open();
				}
			}, 1000 * 60);
		});

		$(window).blur(() => {
			this.activetab = false;
		});
	};

	close = () => {
		this.internalClose = true;
		storageService.set("dejavuPopuptimer", this.timer + 5);
		storageService.set("dejavuPopuptimerAlreadyOpen", "no");
		this.setState({
			showModal: false,
			selectClass: ""
		});
	};

	open = () => {
		if (!this.state.profile) {
			if (!$(".fade.in.modal").length && !$(".typeContainer").hasClass("importer-included")) {
				if (this.activetab) {
					if (storageService.get("dejavuPopuptimerAlreadyOpen") == "no") {
						this.setState({ showModal: true });
						storageService.set("dejavuPopuptimerAlreadyOpen", "yes");
					}
				} else {
					this.holdSubscribe = true;
				}
			} else {
				setTimeout(() => {
					this.open();
					console.log("Subscribe waiting");
				}, 1000 * 2);
			}
		}
	};

	showIcon = () => {
		let icon = (<i className="fa fa-envelope-o" />);
		if (this.state.profile) {
			icon = (<i className="fa fa-check" />);
		}
		return icon;
	};

	subscribe = () => {
		authOperation.login(this.state.subscribeOption);
	};

	subscribeOptionChange = (value) => {
		this.setState({
			subscribeOption: value
		});
	};

	render() {
		return (<div className="add-record-container pd-r10">
			<a href="javascript:void(0);" className="subscribe" title="Subscribe" onClick={this.open} >
				{this.showIcon()}
			</a>
			<Modal keyboard={false} id="subscribeModal" show={this.state.showModal} onHide={this.close}>
				<Modal.Header>
					<Modal.Title>Be in the know about major updates!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-xs-12">
							<div className="row">
								<div className="col-xs-12 single-option">
									<label className="radio-inline">
										<input
											type="radio"
											checked={this.state.subscribeOption === this.options.option1.value}
											onChange={this.subscribeOptionChange.bind(this, this.options.option1.value)}
											name="subscribeOption" id="subscribeOption" value={this.options.option1.value}
										/> {this.options.option1.text}
									</label>
								</div>
								<div className="col-xs-12 single-option">
									<label className="radio-inline">
										<input
											type="radio"
											checked={this.state.subscribeOption === this.options.option2.value}
											onChange={this.subscribeOptionChange.bind(this, this.options.option2.value)}
											name="subscribeOption1" id="subscribeOption1" value={this.options.option2.value}
										/> {this.options.option2.text}
									</label>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xs-12 text-center">
						<button className="btn btn-primary" onClick={this.subscribe}>
							<i className="fa fa-github" /> Subscribe with Github
						  </button>
					</div>
				</Modal.Body>
			</Modal>
		</div>);
	}
}

module.exports = SubscribeModal;
