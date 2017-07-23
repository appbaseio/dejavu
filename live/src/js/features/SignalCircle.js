// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");

import { OverlayTrigger } from "react-bootstrap";

// Signal to indicate stream
class SignalCircle extends React.Component {
	componentDidMount() {

	}

	render() {
		const signalColor = `signal-circle ${this.props.signalColor}`;
		const signalActive = `spinner ${this.props.signalActive}`;
		const OverlayTrigger = ReactBootstrap.OverlayTrigger;
		const Popover = ReactBootstrap.Popover;
		return (
			<OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="signal-pop">{this.props.signalText}</Popover>}>
				  <a className={signalColor}>
					<span className={signalActive} />
				  </a>
			</OverlayTrigger>
		);
	}
}

module.exports = SignalCircle;
