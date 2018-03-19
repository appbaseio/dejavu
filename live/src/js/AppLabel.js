import React from 'react';
import PropTypes from 'prop-types';

const AppLabel = ({ children, success }) => (
	<span className={`app-label ${success ? 'app-label--success' : 'app-label--primary'}`}>
		{children}
	</span>
);

AppLabel.defaultProps = {
	success: false
};

AppLabel.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	success: PropTypes.bool
};

export default AppLabel;
