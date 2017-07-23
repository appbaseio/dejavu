// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");
const AddDocument = require("./AddDocument.js");
const ImportData = require("./ImportData.js");
const Pretty = require("./Pretty.js");
const SignalCircle = require("./SignalCircle.js");
const RemoveFilterButton = require("./RemoveFilterButton.js");
const UpdateDocument = require("./UpdateDocument.js");
const DeleteDocument = require("./DeleteDocument.js");
const ErrorModal = require("./ErrorModal.js");
const ExportasJson = require("./ExportasJson.js");

const FeatureComponent = {
	AddDocument,
	ImportData,
	Pretty,
	SignalCircle,
	RemoveFilterButton,
	UpdateDocument,
	DeleteDocument,
	ErrorModal,
	ExportasJson
};

module.exports = FeatureComponent;
