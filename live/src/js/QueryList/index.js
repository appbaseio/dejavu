var React = require('react');
var AddQuery = require('./AddQuery.js');
var DeleteQuery = require('./DeleteQuery.js');

// QueryList
class QueryList extends React.Component {
	getHistoricList = () => {
		var list = storageService.getItem('dejavuQueryList');
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
		storageService.setItem('dejavuQueryList', list);
	};

	includeQuery = (queryObj, queryIndex = null) => {
		let querylist = this.filterDeleteQuery(queryObj);
		if (queryIndex) {
			querylist = [
				...querylist.slice(0, queryIndex),
				queryObj,
				...querylist.slice(queryIndex + 1)
			];
		} else {
			querylist.push(queryObj);
		}
		this.setHistoricList(querylist);
		this.setState({
			querylist: querylist
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
			selectedQuery: query,
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
		var querylist = this.filterDeleteQuery(this.state.selectedQuery);
		this.setHistoricList(querylist);
		this.setState({
			querylist: querylist,
			showDeleteQuery: false
		});
	};

	filterDeleteQuery = (query) => {
		var list = this.state.querylist.filter(function(item) {
			return item.name !== query.name;
		});
		return list;
	};

	clearQuery = () => {
		this.setState({
			selectedQuery: {
				'name': ''
			}
		});
		this.props.removeExternalQuery();
	};

	isChecked = (name) => {
		return this.props.externalQueryApplied && name === this.state.selectedQuery.name;
	};

	renderQueries = () => {
		return this.state.querylist.map(function(query, index) {
			return (
				<li key={index} className={"list-item col-xs-12 "+ (this.props.externalQueryApplied && query.name === this.state.selectedQuery.name ? 'active' : '')}>
					<div className="theme-element radio">
						<input
							id={"query-"+index}
							type="radio"
							checked={this.isChecked(query.name)}
							onChange={this.applyQuery.bind(this, query)}
							readOnly={false}
							/>
						<label htmlFor={"query-"+index}>
							<span className="col-xs-12 query-name">
								{query.name}
							</span>
						</label>
					</div>
					<a className="btn btn-grey delete-query" onClick={this.applyDeleteQuery.bind(this, query)}>
						<i className="fa fa-times"></i>
					</a>
					<AddQuery
						editable
						queryIndex={index}
						queryInfo={query}
						types={this.props.types}
						selectClass="applyQueryOn"
						includeQuery={this.includeQuery}
					/>
					<span className="pull-right createdAt">
						{moment(query.createdAt).format('Do MMM, h:mm a')}
					</span>
				</li>
			);
		}.bind(this));
	};

	state = {
		querylist: this.getHistoricList(),
		querylistShow: false,
		showDeleteQuery: false,
		selectedQuery: {
			name: ''
		}
	};

	render() {
		return (
			<div className={"querylist-section"}>
				<DeleteQuery
					selectedQuery={this.state.selectedQuery}
					showModal={this.state.showDeleteQuery}
					deleteQuery={this.deleteQuery}
					deleteQueryCb={this.deleteQueryCb} />
				<ul className="theme-list col-xs-12">
					<li className="list-item col-xs-12">
						<AddQuery
							types={this.props.types}
							selectClass="applyQueryOn"
							includeQuery={this.includeQuery} />
					</li>
					{this.renderQueries()}
				</ul>
			</div>
		);
	}
}

module.exports = QueryList;
