const React = require("react");
const FeatureComponent = require("../features/FeatureComponent.js");
const ColumnDropdown = require("./ColumnDropdown.js");

class Info extends React.Component {
	state = {
		selectToggle: false
	};

	selectToggleChange = () => {
		let checkFlag,
			checkbox;
		if (this.state.selectToggle) {
			this.setState({
				selectToggle: false
			});
			checkbox = false;
		}		else {
			this.setState({
				selectToggle: true
			});
			checkbox = true;
		}
		this.props.actionOnRecord.selectToggleChange(checkbox);
	};

	componentDidUpdate() {
		const checkFlag = this.props.actionOnRecord.selectToggle;
		if (this.state.selectToggle !== checkFlag) {
			this.setState({
				selectToggle: checkFlag
			});
		}
	}

	removeFilter = (index) => {
		this.props.removeFilter(index);
	};

	render() {
		const selectedTypes = this.props.selectedTypes ? this.props.selectedTypes : [];
		const infoObj = this.props.infoObj;
		let totalRecord = this.props.externalQueryApplied ? this.props.externalQueryTotal : this.props.totalRecord;
		if (this.props.externalQueryApplied && typeof this.props.externalQueryTotal === "undefined") {
			totalRecord = feed.externalQueryTotal;
		}
		const filterInfo = this.props.filterInfo;
		const sortInfo = this.props.sortInfo;
		const actionOnRecord = this.props.actionOnRecord;
		const hiddenColumns = this.props.hiddenColumns;
		const filterClass = filterInfo.active ? "pull-right text-right" : "hide";
		const sortClass = sortInfo.active ? "pull-right text-right pd-r10" : "hide";
		const typeClass = this.props.selectedTypes.length ? "pull-right text-right pd-r10" : "hide";
		const queryClass = this.props.externalQueryApplied && !queryParams.hasOwnProperty("sidebar") ? "pull-right text-right pd-r10" : "hide";
		const hiddenClass = hiddenColumns.length ? "pull-right text-right pd-r10" : "hide";
		const infoObjClass = !(selectedTypes.length || this.props.externalQueryApplied) ? "hide" : "pull-left text-left pd-l0 recordTotalRow";
		const sortAscClass = sortInfo.active && sortInfo.reverse ? "fa fa-sort-alpha-desc" : "fa fa-sort-alpha-asc";
		const totalClass = actionOnRecord.active ? "hide" : "col-xs-12 pd-l0";
		const selectionClass = actionOnRecord.active ? "col-xs-12 pd-l0" : "hide";
		const UpdateDocument = actionOnRecord.selectedRows.length == 1 ? <FeatureComponent.UpdateDocument actionOnRecord={actionOnRecord} /> : "";
		return (<div className="infoRow container">
			<div className=" row">
				<div className={infoObjClass}>
					<div className={totalClass}>
						<FeatureComponent.ExportasJson dejavuExportData={this.props.dejavuExportData} exportJsonData={this.props.exportJsonData} />
						<a
							href="javascript:void(0);"
							className="btn btn-default themeBtn m-r10"
							onClick={this.props.reloadData}
						>
							<i className="fa fa-refresh" /> Reload
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
								id="selectToggle"
								type="checkbox"
								key="1"
								checked={this.state.selectToggle}
								onChange={this.selectToggleChange}
								readOnly={false}
							/>
							<label htmlFor="selectToggle" />
						</span>
						<span className="pull-left pd-r10 info_single">
							<strong>{actionOnRecord.selectedRows.length}</strong> selected of total
									<strong>&nbsp;{totalRecord}</strong>
						</span>
						<span className="pull-left">{UpdateDocument}
							<FeatureComponent.DeleteDocument
								actionOnRecord={actionOnRecord}
							/>
							<a href="javascript:void(0);" className="info_single" onClick={actionOnRecord.removeSelection}>Remove Selection</a>
						</span>
					</div>
				</div>
				<div className="pull-right pd-r0">
					<ColumnDropdown
						visibleColumns={this.props.visibleColumns}
						columnToggle={this.props.columnToggle}
						cols={this.props.columns}
					/>
					<FeatureComponent.AddDocument
						types={this.props.types}
						addRecord={this.props.addRecord}
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
								<i className="fa fa-times" />
							</span>
						</a>
					</div>
					<div className={queryClass}>
						<a href="javascript:void(0)" className="removeFilter">
							<span className="inside-info">
										Query
									</span>
							<span className="close-btn" onClick={this.props.removeExternalQuery}>
								<i className="fa fa-times" />
							</span>
						</a>
					</div>
					<div className={filterClass}>
						{
									filterInfo.appliedFilter.map((filterItem, index) => (
										<a key={index} href="javascript:void(0)" className="removeFilter m-r10">
											<span className="inside-info">{filterItem.method}:&nbsp;{filterItem.columnName}</span>
											<span className="close-btn" onClick={this.removeFilter.bind(this, index)}>
												<i className="fa fa-times" />
											</span>
										</a>
										))
								}
					</div>
					<div className={sortClass}>
						<a href="javascript:void(0)" className="removeFilter">
							<span className="inside-info">
								<i className={sortAscClass} />&nbsp;{sortInfo.column}
							</span>
							<span className="close-btn" onClick={this.props.removeSort}>
								<i className="fa fa-times" />
							</span>
						</a>
					</div>
					<div className={hiddenClass}>
						<a href="javascript:void(0)" className="removeFilter">
							<span className="inside-info">
								<i className="fa fa-eye-slash" />&nbsp;hide:&nbsp;{hiddenColumns.length}
							</span>
							<span className="close-btn" onClick={this.props.removeHidden}>
								<i className="fa fa-times" />
							</span>
						</a>
					</div>
				</div>
			</div>
		</div>);
	}
}

module.exports = Info;
