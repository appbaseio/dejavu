// @flow

import React, { Fragment } from 'react';
import { Alert } from 'antd';
import { connect } from 'react-redux';

import ErrorMessage from './ErrorMessage';

import { getError } from '../../reducers/error';
import { clearError } from '../../actions';

type Props = {
	error?: any,
	onDismissError: () => void,
};

const FlashMessage = ({ error, onDismissError }: Props) => (
	<Fragment>
		{error && (
			<Alert
				message={error.message}
				type="error"
				closable
				css={{ marginBottom: 10 }}
				onClose={onDismissError}
				description={<ErrorMessage description={error.description} />}
			/>
		)}
	</Fragment>
);

const mapStateToProps = state => ({
	error: getError(state),
});

const mapDispatchToProps = {
	onDismissError: clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);
