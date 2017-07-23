const React = require("react");
const AddQuery = require("./AddQuery.js");
const DeleteQuery = require("./DeleteQuery.js");

// QueryList
class QueryList extends React.Component {
	getHistoricList = () => {
		let list = storageService.getItem("dejavuQueryList");
		if (list) {
			try {
				list = JSON.parse(list);
			} catch (e) {
				list = [];
			}
		} else {
			list = [];
		}
		return list;
	};

	setHistoricList = (list) => {
		var list = JSON.stringify(list);
		storageService.setItem("dejavuQueryList", list);
	};

	includeQuery = (queryObj) => {
		const querylist = this.filterDeleteQuery(queryObj);
		querylist.push(queryObj);
		this.setHistoricList(querylist);
		this.setState({
			querylist
		}, this.applyQuery.call(this, queryObj));
	};

	applyQuery = (query) => {
		if (this.props.externalQueryApplied) {
			if (this.state.selectedQuery.name !== query.name) {
				this.justApplyQuery(query);
			}
		} else {
			this.justApplyQuery(query);
		}
	};

	justApplyQuery = (query) => {
		this.setState({
			selectedQuery: query
		});
		this.props.externalQuery(query);
	};

	applyDeleteQuery = (query) => {
		this.setState({
			selectedQuery: query,
			showDeleteQuery: true
		});
	};

	deleteQueryCb = (val) => {
		this.setState({
			showDeleteQuery: val
		});
	};

	deleteQuery = () => {
		const querylist = this.filterDeleteQuery(this.state.selectedQuery);
		this.setHistoricList(querylist);
		this.setState({
			querylist,
			showDeleteQuery: false
		});
	};

	filterDeleteQuery = (query) => {
		const list = this.state.querylist.filter(item => item.name !== query.name);
		return list;
	};

	clearQuery = () => {
		this.setState({
			selectedQuery: {
				name: ""
			}
		});
		this.props.removeExternalQuery();
	};

	isChecked = name => this.props.externalQueryApplied && name === this.state.selectedQuery.name;

	renderQueries = () => this.state.querylist.map((query, index) => (
		<li key={index} className={`list-item col-xs-12 ${this.props.externalQueryApplied && query.name === this.state.selectedQuery.name ? "active" : ""}`}>
			<div className="theme-element radio">
				<input
					id={`query-${index}`}
					type="radio"
					checked={this.isChecked(query.name)}
					onChange={this.applyQuery.bind(this, query)}
					readOnly={false}
				/>
				<label htmlFor={`query-${index}`}>
					<span className="col-xs-12 query-name">
						{query.name}
						<span className="pull-right createdAt">
							{moment(query.createdAt).format("Do MMM, h:mm a")}
						</span>
					</span>
				</label>
			</div>
			<a className="btn btn-grey delete-query" onClick={this.applyDeleteQuery.bind(this, query)}>
				<i className="fa fa-times" />
			</a>
		</li>
			));

	state = {
		querylist: this.getHistoricList(),
		querylistShow: false,
		showDeleteQuery: false,
		selectedQuery: {
			name: ""
		}
	};

	render() {
		return (
			<div className={"querylist-section"}>
				<DeleteQuery
					selectedQuery={this.state.selectedQuery}
					showModal={this.state.showDeleteQuery}
					deleteQuery={this.deleteQuery}
					deleteQueryCb={this.deleteQueryCb}
				/>
				<ul className="theme-list col-xs-12">
					<li className="list-item col-xs-12">
						<AddQuery
							types={this.props.types}
							selectClass="applyQueryOn"
							includeQuery={this.includeQuery}
						/>
					</li>
					{this.renderQueries()}
				</ul>
			</div>
		);
	}
}

module.exports = QueryList;
