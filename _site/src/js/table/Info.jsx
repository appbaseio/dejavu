var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FeatureComponent = require('../features/FeatureComponent.jsx');
var Dropdown = require('./Dropdown.jsx');

var Info = React.createClass({
	 getInitialState: function() {
		return {
			selectToggle: false
		};
	},
	selectToggleChange: function() {
		var checkFlag;
		if(this.state.selectToggle) {
			this.setState({
				selectToggle: false
			});
			checkbox = false;
		}
		else {
			this.setState({
				selectToggle: true
			});   
			checkbox = true;
		}
		this.props.actionOnRecord.selectToggleChange(checkbox);
	},
	componentDidUpdate: function() {
		var checkFlag = this.props.actionOnRecord.selectToggle;
		if(this.state.selectToggle !== checkFlag) {
			this.setState({
				selectToggle: checkFlag
			});
		}
	},
	render: function() {
		var selectedTypes = this.props.selectedTypes ? this.props.selectedTypes : [];
		var infoObj = this.props.infoObj;
		var totalRecord = this.props.externalQueryApplied ? this.props.externalQueryTotal : this.props.totalRecord;
		if(this.props.externalQueryApplied && typeof this.props.externalQueryTotal == 'undefined') {
			totalRecord = feed.externalQueryTotal
		}
		var filterInfo = this.props.filterInfo;
		var sortInfo = this.props.sortInfo;
		var actionOnRecord = this.props.actionOnRecord;
		var hiddenColumns = this.props.hiddenColumns;
		var filterClass = filterInfo.active ? 'pull-right text-right pd-r10' : 'hide';
		var sortClass = sortInfo.active ? 'pull-right text-right pd-r10' : 'hide';
		var typeClass = this.props.selectedTypes.length ? 'pull-right text-right pd-r10' : 'hide';
		var queryClass = this.props.externalQueryApplied && !queryParams.hasOwnProperty('sidebar') ? 'pull-right text-right pd-r10' : 'hide';
		var hiddenClass = hiddenColumns.length ? 'pull-right text-right pd-r10' : 'hide';
		var infoObjClass = !(selectedTypes.length || this.props.externalQueryApplied) ? "hide" : "pull-left text-left pd-l0 recordTotalRow";
		var sortAscClass = sortInfo.active && sortInfo.reverse ? 'fa fa-sort-alpha-desc' : 'fa fa-sort-alpha-asc';
		var totalClass = actionOnRecord.active ? 'hide' : 'col-xs-12 pd-l0';
		var selectionClass = actionOnRecord.active ? 'col-xs-12 pd-l0' : 'hide';
		var UpdateDocument = actionOnRecord.selectedRows.length == 1 ? <FeatureComponent.UpdateDocument actionOnRecord={actionOnRecord}/> : '';
		return (<div className="infoRow container">
					<div className=" row">
						<div className={infoObjClass}>
							<div className={totalClass}>
								<FeatureComponent.ExportasJson dejavuExportData={this.props.dejavuExportData} exportJsonData = {this.props.exportJsonData} />
								<a
									href="javascript:void(0);"
									className="btn btn-default themeBtn m-r10"
									onClick={this.props.reloadData}>
									<i className="fa fa-refresh"></i> Reload
								</a>
								<span className="info_single">
									<label>Showing
										<strong>&nbsp;{infoObj.showing}</strong> of total
										<strong>&nbsp;{totalRecord}</strong>
									</label>
								</span>
							</div>
							<div className={selectionClass}>
							<span className="theme-element checkbox pull-left pd-r10 mt-5">
								<input
									 id='selectToggle'
									 type="checkbox"
									 key='1'
									 checked={this.state.selectToggle}
									 onChange={this.selectToggleChange}
									 readOnly={false}/>
									<label htmlFor='selectToggle'></label>
							</span>
								<span className="pull-left pd-r10 info_single">
									<strong>{actionOnRecord.selectedRows.length}</strong> selected of total
									<strong>&nbsp;{totalRecord}</strong>
								</span>
								<span className="pull-left">{UpdateDocument}
									<FeatureComponent.DeleteDocument
												actionOnRecord={actionOnRecord}/>
									<a href="javascript:void(0);" className="info_single" onClick={actionOnRecord.removeSelection}>Remove Selection</a>
								</span>
							</div>
						</div>
						<div className="pull-right pd-r0">
							<Dropdown
										visibleColumns ={this.props.visibleColumns}
										columnToggle ={this.props.columnToggle}
										 cols={this.props.columns} />
							<FeatureComponent.AddDocument
											types={this.props.types}
											addRecord ={this.props.addRecord}
											getTypeDoc={this.props.getTypeDoc}
											userTouchAdd={this.props.infoObj.userTouchAdd}
											selectClass="tags-select-small" />
							<div className={typeClass}>
								<a href="javascript:void(0)" className="removeFilter">
									<span className="inside-info">
										Types: {this.props.selectedTypes.length}
									</span>
									<span className="close-btn" onClick={this.props.removeTypes}>
										<i className="fa fa-times"></i>
									</span>
								</a>
							</div>
							<div className={queryClass}>
								<a href="javascript:void(0)" className="removeFilter">
									<span className="inside-info">
										Query
									</span>
									<span className="close-btn" onClick={this.props.removeExternalQuery}>
										<i className="fa fa-times"></i>
									</span>
								</a>
							</div>
							<div className={filterClass}>
								<a href="javascript:void(0)" className="removeFilter">
									<span className="inside-info">{filterInfo.method}:&nbsp;{filterInfo.columnName}</span>
									<span className="close-btn" onClick={this.props.removeFilter}>
										<i className="fa fa-times"></i>
									</span>
								</a>
							</div>
							<div className={sortClass}>
								<a href="javascript:void(0)" className="removeFilter">
									<span className="inside-info">
										<i className={sortAscClass}></i>&nbsp;{sortInfo.column}
									</span>
									<span className="close-btn" onClick={this.props.removeSort}>
										<i className="fa fa-times"></i>
									</span>
								</a>
							</div>
							<div className={hiddenClass}>
								<a href="javascript:void(0)" className="removeFilter">
									<span className="inside-info">
										<i className="fa fa-eye-slash"></i>&nbsp;hide:&nbsp;{hiddenColumns.length}
									</span>
									<span className="close-btn" onClick={this.props.removeHidden}>
										<i className="fa fa-times"></i>
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>)
	}
});

module.exports = Info;
