import React from 'react';
import PropTypes from 'prop-types';

const AppLabel = ({ success }) => (
	<span className={`app-label ${success ? 'app-label--success' : 'app-label--primary'}`} />
);

AppLabel.defaultProps = {
	success: false
};

AppLabel.propTypes = {
	success: PropTypes.bool
};

export default AppLabel;
