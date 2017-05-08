//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { OverlayTrigger, Popover } from 'react-bootstrap';

//Remove filter
class RemoveFilterButton extends React.Component {
	componentDidMount() {

	}

	render() {
		var filterInfoText = JSON.stringify(this.props.filterInfo);
		var OverlayTrigger = ReactBootstrap.OverlayTrigger;
		var Popover = ReactBootstrap.Popover;
		var removeclass = this.props.filterInfo.active ? "removeFilterbtn" : "hide";
		return (
			<OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="remove-pop">{filterInfoText}</Popover>}>
				  <a className={removeclass} onClick={this.props.removeFilter}>
					<i className="fa fa-times"></i>
				  </a>
				</OverlayTrigger>
		);
	}
}

module.exports = RemoveFilterButton;