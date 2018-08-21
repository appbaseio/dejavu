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

export default () => {
	let credentials = null;

	if (window.USERNAME !== 'test' && window.PASSWORD !== 'test') {
		credentials = `${window.USERNAME}:${window.PASSWORD}`;
	}

	return (
		<Wrapper>
			<SearchSandbox
				appName={window.APPNAME}
				credentials={credentials}
				url={window.HOST}
			>
				<Editor mappingsURL="https://opensource.appbase.io/dejavu/mappings" />
			</SearchSandbox>
		</Wrapper>
	);
};
