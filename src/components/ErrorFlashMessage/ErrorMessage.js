// @flow

import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';
import { Button } from 'antd';

type State = {
	isShowingDetails: boolean,
};

type Props = {
	description: string,
};

class ErrorMessage extends Component<Props, State> {
	state = {
		isShowingDetails: false,
	};

	toggleDetails = () => {
		this.setState(prevState => ({
			isShowingDetails: !prevState.isShowingDetails,
		}));
	};

	render() {
		const { isShowingDetails } = this.state;
		const { description } = this.props;
		return (
			<Fragment>
				<Button size="small" onClick={this.toggleDetails}>
					{isShowingDetails ? 'Hide' : 'Show'}
					&nbsp; information
				</Button>
				{isShowingDetails && <pre>{description}</pre>}
			</Fragment>
		);
	}
}

ErrorMessage.propTypes = {
	description: string.isRequired,
};

export default ErrorMessage;
