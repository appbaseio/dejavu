import React from 'react';

import { IMPORTER_LINK } from '../constants';

const Importer = () => (
	<section css={{ height: '85vh' }}>
		<iframe
			title="Importer"
			src={`${IMPORTER_LINK}`}
			frameBorder="0"
			width="100%"
			height="100%"
		/>
	</section>
);

export default Importer;
