//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');
import { Tabs, Tab } from 'react-bootstrap';
var TypeTable = require('./TypeTable.js');
var QueryList= require('./QueryList/index.js');
var Importer = require('./features/Importer.js');

class Sidebar extends React.Component {
	state = {};

	render() {
		return (
			<Tabs defaultActiveKey={1} id="dejavu-sidebar">
				<Tab 
					eventKey={1} 
					title="Types">
					<TypeTable {...this.props.typeProps} />
					<Importer />
				</Tab>
				<Tab 
					eventKey={2} 
					title="Queries">
					<QueryList {...this.props.queryProps} />
				</Tab>
			</Tabs>
		);
	}
}

module.exports = Sidebar;