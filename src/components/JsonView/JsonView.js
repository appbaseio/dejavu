import React from 'react';
import { object } from 'prop-types';

const JsonView = ({ json }) => (
	<pre css={{ margin: 0 }}>{JSON.stringify(json, null, 2)}</pre>
);

JsonView.defaultProps = {
	json: {},
};

JsonView.propTypes = {
	json: object,
};

export default JsonView;
