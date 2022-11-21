// @flow

import React, { Component, Fragment } from 'react';
import { string, func } from 'prop-types';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { connect } from 'react-redux';
import createDOMPurify from 'dompurify';
import { reloadApp } from '../../actions/app';

const DOMPurify = createDOMPurify(window);

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
					<ReloadOutlined />
					Reload
				</Button>
				<Button size="small" onClick={this.toggleDetails}>
					{isShowingDetails ? 'Hide' : 'Show'}
					&nbsp; information
				</Button>
				<br />
				{isShowingDetails && (
					<div
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(description),
						}}
					/>
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
