// @flow

import React from 'react';

const Importer = () => (
	<section
		css={{
			'.ui-layout-pane': {
				borderRadius: '3px',
				borderColor: '#eee',
			},
		}}
	>
		<iframe
			title="Importer"
			src="https://importer.appbase.io"
			frameBorder="0"
			width="100%"
			style={{
				height: '80vh',
			}}
		/>
	</section>
);

export default Importer;
