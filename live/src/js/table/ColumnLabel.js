import React from 'react';
import PropTypes from 'prop-types';

const ColumnLabel = ({ children }) => (
	<span className="column-label">{children}</span>
);

ColumnLabel.propTypes = {
	children: PropTypes.string
};

export default ColumnLabel;
