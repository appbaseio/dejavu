//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { OverlayTrigger } from 'react-bootstrap';

//Signal to indicate stream
class SignalCircle extends React.Component {
	componentDidMount() {

	}

	render() {
		var signalColor = "signal-circle " + this.props.signalColor;
		var signalActive = "spinner " + this.props.signalActive;
		var OverlayTrigger = ReactBootstrap.OverlayTrigger;
		var Popover = ReactBootstrap.Popover;
		return (
			<OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="signal-pop">{this.props.signalText}</Popover>}>
				  <a className={signalColor}>
					<span className={signalActive}></span>
				  </a>
				</OverlayTrigger>
		);
	}
}

module.exports = SignalCircle;