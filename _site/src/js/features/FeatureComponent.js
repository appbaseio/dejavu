//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
var AddDocument = require('./AddDocument.js');
var ImportData = require('./ImportData.js');
var Pretty = require('./Pretty.js');
var SignalCircle = require('./SignalCircle.js');
var RemoveFilterButton = require('./RemoveFilterButton.js');
var UpdateDocument = require('./UpdateDocument.js');
var DeleteDocument = require('./DeleteDocument.js');
var ErrorModal = require('./ErrorModal.js');
var ExportasJson = require('./ExportasJson.js');

var FeatureComponent = {
	AddDocument: AddDocument,
	ImportData: ImportData,
	Pretty: Pretty,
	SignalCircle: SignalCircle,
	RemoveFilterButton: RemoveFilterButton,
	UpdateDocument: UpdateDocument,
	DeleteDocument: DeleteDocument,
	ErrorModal: ErrorModal,
	ExportasJson: ExportasJson
};

module.exports = FeatureComponent;
