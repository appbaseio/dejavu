var React = require('react');
var ReactDOM = require('react-dom');
var Importer = require('../../src/js/features/Importer.js');

function onClose() {
	window.location.href = "../index.html";
}

ReactDOM.render(<Importer directImporter={true} onClose={onClose} />, document.getElementById('main'));