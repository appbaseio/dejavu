var React = require('react');
var ReactDOM = require('react-dom');
var Importer = require('../../src/js/features/Importer.js');

function onClose() {
	const isDejavuUrl = sessionStorage.getItem("dejavuUrl");
	if(isDejavuUrl) {
		sessionStorage.removeItem("dejavuUrl");
		window.location.href = isDejavuUrl;
	} else {
		window.location.href = "../index.html";
	}
}

ReactDOM.render(<Importer directImporter={true} onClose={onClose} />, document.getElementById('main'));