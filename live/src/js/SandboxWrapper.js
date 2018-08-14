import React from 'react';
import styled from 'react-emotion';

import SearchSandbox from '../../../batteries/components/SearchSandbox';
import Editor from '../../../batteries/components/SearchSandbox/containers/Editor';

const Wrapper = styled('div')`
	width: 100%;
	height: calc(100vh - 108px);
	position: fixed;
	top: 76px;
	left: 0;
	z-index: 999999;
	background-color: #eee;
	overflow-y: scroll;
`;

export { Wrapper };

export default () => (
	<Wrapper>
		<SearchSandbox
			appName={window.APPNAME}
			credentials={`${window.USERNAME}:${window.PASSWORD}`}
			url={window.HOST}
		>
			<Editor />
		</SearchSandbox>
	</Wrapper>
);
