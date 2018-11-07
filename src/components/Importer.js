import React, { Fragment } from 'react';

import { IMPORTER_LINK } from '../constants';

const Importer = () => (
	<Fragment>
		<iframe
			title="Importer"
			src={`${IMPORTER_LINK}`}
			frameBorder="0"
			width="100%"
			height={`${window.innerHeight - 243 || 600}px`}
		/>
	</Fragment>
);

export default Importer;
