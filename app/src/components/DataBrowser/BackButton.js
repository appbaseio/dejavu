import React from 'react';
import { Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { css } from 'emotion';

const buttonStyles = css`
	position: absolute;
	top: 5px;
	left: 0px;
`;

const BackButton = props => {
	const { history, location } = props;
	const listingPageURL = `promoted-results-queries/${location.search}`;
	return (
		<Button css={buttonStyles} onClick={() => history.push(listingPageURL)}>
			<Icon type="arrow-left" />
			Back to Query Rules
		</Button>
	);
};

export default withRouter(BackButton);
