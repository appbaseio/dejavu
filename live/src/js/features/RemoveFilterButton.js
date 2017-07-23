// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");

import { OverlayTrigger, Popover } from "react-bootstrap";

// Remove filter
class RemoveFilterButton extends React.Component {
	componentDidMount() {

	}

	render() {
		const filterInfoText = JSON.stringify(this.props.filterInfo);
		const OverlayTrigger = ReactBootstrap.OverlayTrigger;
		const Popover = ReactBootstrap.Popover;
		const removeclass = this.props.filterInfo.active ? "removeFilterbtn" : "hide";
		return (
			<OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="remove-pop">{filterInfoText}</Popover>}>
				  <a className={removeclass} onClick={this.props.removeFilter}>
					<i className="fa fa-times" />
				  </a>
			</OverlayTrigger>
		);
	}
}

module.exports = RemoveFilterButton;
