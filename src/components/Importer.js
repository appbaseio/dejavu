import React from 'react';

import { IMPORTER_LINK } from '../constants';

const Importer = () => (
	<section>
		<iframe
			title="Importer"
			src={`${IMPORTER_LINK}`}
			frameBorder="0"
			width="100%"
			style={{
				height: '75vh',
			}}
		/>
	</section>
);

export default Importer;
