import React from 'react';
import ReactDOM from 'react-dom';

import Importer from '../../live/src/js/features/Importer';

function onClose() {
	const isDejavuUrl = sessionStorage.getItem('dejavuUrl');
	if (isDejavuUrl) {
		sessionStorage.removeItem('dejavuUrl');
		window.location.href = isDejavuUrl;
	} else {
		window.location.href = '../live/index.html';
	}
}

ReactDOM.render(<Importer directImporter={true} onClose={onClose} />, document.getElementById('main'));
