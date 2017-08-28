import React from 'react';
import PropTypes from 'prop-types';

const AddRowButton = ({ children, onClick }) => (
	<div
		className="add-row-button"
		onClick={onClick}
	>
		{children}
	</div>
);

AddRowButton.defaultProps = {
	children: PropTypes.string
};

export default AddRowButton;
