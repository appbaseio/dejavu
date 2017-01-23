var React = require('react');
var AddQuery = require('./AddQuery.jsx');
var DeleteQuery = require('./DeleteQuery.jsx');

// QueryList
var QueryList = React.createClass({
	getInitialState: function() {
		return {
			querylist: this.getHistoricList(),
			querylistShow: false,
			showDeleteQuery: false,
			selectedQuery: {
				name: ''
			}
		};
	},
	getHistoricList: function() {
		var list = storageService.getItem('dejavuQueryList');
		if(list) {
			try {
				list = JSON.parse(list);
			} catch(e) {
				list = [];
			}
		} else {
			list = [];
		}
		return list;
	},
	setHistoricList: function(list) {
		var list = JSON.stringify(list);
		storageService.setItem('dejavuQueryList', list);
	},
	includeQuery: function(queryObj) {
		var querylist = this.filterDeleteQuery(queryObj);
		querylist.push(queryObj);
		this.setHistoricList(querylist);
		this.setState({
			querylist: querylist
		}, this.applyQuery.call(this, queryObj));
	},
	applyQuery: function(query) {
		if(this.props.externalQueryApplied) {
			if(this.state.selectedQuery.name !== query.name) {
				this.justApplyQuery(query);
			}
		} else {
			this.justApplyQuery(query);
		}
	},
	justApplyQuery: function(query) {
		this.setState({
			selectedQuery: query,
		});
		this.props.externalQuery(query);
	},
	applyDeleteQuery: function(query) {
		this.setState({
			selectedQuery: query,
			showDeleteQuery: true
		});
	},
	deleteQueryCb: function(val) {
		this.setState({
			showDeleteQuery: val
		});
	},
	deleteQuery: function() {
		var querylist = this.filterDeleteQuery(this.state.selectedQuery);
		this.setHistoricList(querylist);
		this.setState({
			querylist: querylist,
			showDeleteQuery: false
		});
	},
	filterDeleteQuery: function(query) {
		var list = this.state.querylist.filter(function(item) {
			return item.name !== query.name;
		});
		return list;
	},
	clearQuery: function() {
		this.setState({
			selectedQuery: {
				'name': ''
			}
		});
		this.props.removeExternalQuery();
	},
	isChecked: function(name) {
		return this.props.externalQueryApplied && name === this.state.selectedQuery.name;
	},
	renderQueries: function() {
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
								<span className="pull-right createdAt">
									{moment(query.createdAt).format('Do MMM, h:mm a')}
								</span>
							</span>
						</label>
					</div>
					<a className="btn btn-grey delete-query" onClick={this.applyDeleteQuery.bind(this, query)}>
						<i className="fa fa-times"></i>
					</a>
				</li>
			);
		}.bind(this));
	},
	render: function() {
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
});

module.exports = QueryList;