// @flow

import React, { Component, Fragment } from 'react';
import { string, func } from 'prop-types';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { reloadApp } from '../../actions/app';

type State = {
	isShowingDetails: boolean,
};

type Props = {
	description?: string,
	handleReload: func,
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
		const { description, handleReload } = this.props;
		return (
			<Fragment>
				<Button
					size="small"
					type="primary"
					style={{ marginRight: 8 }}
					onClick={handleReload}
				>
					<Icon type="reload" />
					Reload
				</Button>
				<Button size="small" onClick={this.toggleDetails}>
					{isShowingDetails ? 'Hide' : 'Show'}
					&nbsp; information
				</Button>
				<br />
				{isShowingDetails && (
					<div dangerouslySetInnerHTML={{ __html: description }} />
				)}
			</Fragment>
		);
	}
}

ErrorMessage.propTypes = {
	description: string,
	handleReload: func.isRequired,
};

const mapDispatchToProps = dispatch => ({
	handleReload: () => dispatch(reloadApp()),
});

export default connect(null, mapDispatchToProps)(ErrorMessage);
