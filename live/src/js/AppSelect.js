// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");

class AppSelect extends React.Component {
	state = {
		selectVal: null,
		apps: null,
		searchValue: "",
		setAppClass: "hide",
		touched: false
	};

	componentDidUpdate() {
		if (!this.props.splash && config.appname && this.state.searchValue === "" && !this.state.touched) {
			this.setState({
				searchValue: config.appname,
				touched: true
			});
		}
	}

	handleInput = (event) => {
		this.setState({
			searchValue: event.target.value
		});
		if (this.props.appnameCb) {
			this.props.appnameCb(event.target.value);
		}
	};

	focusInput = () => {
		if (this.props.apps.length && !this.props.connect) {
			this.setState({
				setAppClass: "show"
			});
		}
	};

	blurInput = () => {
		setTimeout(() => {
			this.setState({
				setAppClass: "hide"
			});
		}, 300);
	};

	selectOption = (appname) => {
		this.setState({
			searchValue: appname
		});
		const app_config = this.props.apps.filter((app, index) => {
			if (app.appname === appname) {
				return {
					appname: app.appname,
					url: app.url
				};
			}
		});
		if (app_config.length && app_config[0].url) {
			this.props.setConfig(app_config[0].url);
		}
	};

	render() {
		const opts = {};
		let optionsArr = [];
		if (this.props.connect) {
			opts.readOnly = "readOnly";
		}
		if (this.props.apps && this.props.apps.length) {
			optionsArr = this.props.apps.filter((app, index) => this.state.searchValue === "" || (this.state.searchValue !== "" && app.appname.toUpperCase().indexOf(this.state.searchValue.toUpperCase()) !== -1));
		}

		const options = optionsArr.map((app, index) => (
			<li key={index} onClick={this.selectOption.bind(this, app.appname)}>{app.appname}</li>
		));

		const searchValue = this.state.searchValue;
		const setAppClass = options.length == 0 ? "hide" : `autolist setApp col-xs-12 ${this.state.setAppClass}`;
		return (<div className="autocomplete">
			<input
				className="search form-control"
				type="text"
				value={searchValue}
				name="appname"
				placeholder="Appname (aka index) goes here"
				onChange={this.handleInput}
				onFocus={this.focusInput} onBlur={this.blurInput} {...opts}
			/>
			<ul id="setApp" className={setAppClass} name="apps">
				{options}
			</ul>
		</div>
		);
	}
}

module.exports = AppSelect;
