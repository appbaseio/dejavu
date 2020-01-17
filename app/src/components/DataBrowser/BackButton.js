import React from 'react';
import { Button, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { css } from 'emotion';

const buttonStyles = css`
	position: absolute;
	top: 15px;
	left: 20px;
`;

const BackButton = props => {
	const { location } = props;
	const listingPageURL = `promoted-results-queries/${location.search}`;
	return (
		<Link to={listingPageURL}>
			<Button css={buttonStyles}>
				<Icon type="arrow-left" />
				Back to Query Rules
			</Button>
		</Link>
	);
};

export default withRouter(BackButton);
