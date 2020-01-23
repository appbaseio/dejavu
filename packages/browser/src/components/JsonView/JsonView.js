// @flow
import React from 'react';
import { object, oneOfType, array } from 'prop-types';

type Props = {
	json?: object | array,
};

const JsonView = ({ json }: Props) => (
	<pre css={{ margin: 0 }}>{JSON.stringify(json, null, 2)}</pre>
);

JsonView.defaultProps = {
	json: {},
};

JsonView.propTypes = {
	json: oneOfType([object, array]),
};

export default JsonView;
