import React, { Component } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import CreateColumnForm from './CreateColumnForm';

class AddColumnButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expand: false
		};
	}

	// to handle react-bootstrap Popover arrow position
	toggleExpand = (nextState) => {
		this.setState({
			expand: nextState
		});
	}

	render() {
		return (
			<OverlayTrigger
				trigger="click"
				rootClose
				placement="left"
				overlay={
					<Popover id="add-column-overlay" className={`add-column-overlay ${this.state.expand ? 'expand' : ''}`}>
						<CreateColumnForm {...this.props} toggleExpand={this.toggleExpand} />
					</Popover>
				}
			>
				<div
					className="add-column-button btn btn-primary"
				>
					<i className="fa fa-plus" />
				</div>
			</OverlayTrigger>
		);
	}
}

export default AddColumnButton;
