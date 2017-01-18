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
		var list = storageService.getItem('queryList');
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
		storageService.setItem('queryList', list);
	},
	includeQuery: function(queryObj) {
		this.props.externalQuery(queryObj.query);
		var querylist = this.filterDeleteQuery(queryObj);
		querylist.push(queryObj);
		this.setHistoricList(querylist);
		this.setState({
			querylist: querylist
		});
	},
	applyQuery: function(query) {
		this.setState({
			selectedQuery: query,
		});
		this.props.externalQuery(query.query);
	},
	applyDeleteQuery: function(query) {
		this.setState({
			selectedQuery: query,
			showDeleteQuery: true
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
	renderQueries: function() {
		return this.state.querylist.map(function(query, index) {
			return (
				<li key={index} className={"list-item col-xs-12 "+ (query.name === this.state.selectedQuery.name ? 'active' : '')}>
					<a className="col-xs-12 pd-0" onClick={this.applyQuery.bind(this, query)}>
						<span className="col-xs-12 query-name">
							{query.name}
							<span className="pull-right createdAt">
								{moment(query.createdAt).format('Do MMM, h:mm a')}
							</span>
						</span>
					</a>
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
					deleteQuery={this.deleteQuery} />
				<ul className="theme-list col-xs-12">
					<li className="list-item col-xs-12">
						<span>
							<a className="remove-query text-danger" onClick={this.clearQuery}>
								Remove
							</a>
						</span>
						<AddQuery includeQuery={this.includeQuery} />
					</li>
					{this.renderQueries()}
				</ul>
			</div>
		);
	}
});

module.exports = QueryList;