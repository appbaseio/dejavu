import React from 'react';
import { Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';

const BackButton = props => {
	const { history, location } = props;
	const listingPageURL = `promoted-results-queries/${location.search}`;
	return (
		<Button onClick={() => history.push(listingPageURL)}>
			<Icon type="arrow-left" />
			Back to Query Rules
		</Button>
	);
};

export default withRouter(BackButton);
