import React from 'react';
import { Wrapper } from './SandboxWrapper';

import Mappings from '../../../batteries/components/Mappings';

export default () => {
	let credentials = null;

	if (window.USERNAME !== 'test' && window.PASSWORD !== 'test') {
		credentials = `${window.USERNAME}:${window.PASSWORD}`;
	}

	return (
		<Wrapper>
			<Mappings
				appName={window.APPNAME}
				credentials={credentials}
				url={window.HOST}
			/>
		</Wrapper>
	);
};
