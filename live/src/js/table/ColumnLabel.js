import React from 'react';
import PropTypes from 'prop-types';

const ColumnLabel = ({ children }) => (
	<span className="column-label">{children}</span>
);

ColumnLabel.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	])
};

export default ColumnLabel;
