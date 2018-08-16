import React from 'react';
import { Wrapper } from './SandboxWrapper';

import Mappings from '../../../batteries/components/Mappings';

export default () => (
	<Wrapper>
		<Mappings
			appName={window.APPNAME}
			credentials={`${window.USERNAME}:${window.PASSWORD}`}
			url={window.HOST}
		/>
	</Wrapper>
);
