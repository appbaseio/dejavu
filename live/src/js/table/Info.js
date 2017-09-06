var React = require('react');
var FeatureComponent = require('../features/FeatureComponent.js');
var ColumnDropdown = require('./ColumnDropdown.js');

class Info extends React.Component {
	state = {
		selectToggle: false
	};

	selectToggleChange = () => {
		var checkFlag, checkbox;
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
	};

	componentDidUpdate() {
		var checkFlag = this.props.actionOnRecord.selectToggle;
		if(this.state.selectToggle !== checkFlag) {
			this.setState({
				selectToggle: checkFlag
			});
		}
	}

	removeFilter = (index) => {
		this.props.removeFilter(index);
	};

	render() {
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
		var filterClass = filterInfo.active ? 'pull-right text-right' : 'hide';
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
				{
					this.props.editable ?
						<button className="btn btn-warning" onClick={this.props.toggleEditView}>
							<span className="button-icon"><i className="fa fa-pencil-square-o" /></span>Edit View
						</button> :
						<button className="btn btn-success" onClick={this.props.toggleEditView}>
							<span className="button-icon"><i className="fa fa-eye" /></span>Read Only View
						</button>
				}
				<div className="pull-right pd-r0">
					<ColumnDropdown
						visibleColumns ={this.props.visibleColumns}
						columnToggle ={this.props.columnToggle}
						cols={this.props.columns} />

					<FeatureComponent.AddDocument
						types={this.props.types}
						text="Add Data"
						addRecord ={this.props.addRecord}
						getTypeDoc={this.props.getTypeDoc}
						userTouchAdd={this.props.infoObj.userTouchAdd}
						selectClass="tags-select-small"
					/>
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
								{
									filterInfo.appliedFilter.map(function(filterItem, index) {
										return (
											<a key={index} href="javascript:void(0)" className="removeFilter m-r10">
												<span className="inside-info">{filterItem.method}:&nbsp;{filterItem.columnName}</span>
												<span className="close-btn" onClick={this.removeFilter.bind(this, index)}>
													<i className="fa fa-times"></i>
												</span>
											</a>
										);
									}.bind(this))
								}
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
}

module.exports = Info;
