import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';
import { Button } from 'antd';

class ErrorMessage extends Component {
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
					{isShowingDetails ? 'Hide ' : 'Show '}
					information
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
