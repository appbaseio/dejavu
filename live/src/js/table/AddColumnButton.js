import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import CreateColumnForm from './CreateColumnForm';

const AddColumnButton = props => (
	<OverlayTrigger
		trigger="click"
		rootClose
		placement="left"
		overlay={
			<Popover id="add-column-overlay" className="add-column-overlay">
				<CreateColumnForm {...props} />
			</Popover>
		}
	>
		<div
			className="add-column-button btn btn-primary"
		>
			...
		</div>
	</OverlayTrigger>
);

export default AddColumnButton;
