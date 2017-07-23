// This contains the extra features like
// Import data, Export Data, Add document, Pretty Json
const React = require("react");

import { Tabs, Tab } from "react-bootstrap";

const TypeTable = require("./TypeTable.js");
const QueryList = require("./QueryList/index.js");
const ImporterSidebar = require("./features/ImporterSidebar.js");

class Sidebar extends React.Component {
	state = {};

	render() {
		return (
			<Tabs defaultActiveKey={1} id="dejavu-sidebar">
				<Tab
					eventKey={1}
					title="Types"
				>
					<TypeTable {...this.props.typeProps} />
					<ImporterSidebar clone={true} {...this.props.importer} />
					<ImporterSidebar {...this.props.importer} />
				</Tab>
				<Tab
					eventKey={2}
					title="Queries"
				>
					<QueryList {...this.props.queryProps} />
				</Tab>
			</Tabs>
		);
	}
}

module.exports = Sidebar;
