var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FeatureComponent = require('../features/featureComponent.jsx');
var Dropdown = require('./dropdown.jsx');

var Info = React.createClass({
    render: function() {
        var infoObj = this.props.infoObj;
        var totalRecord = this.props.totalRecord;
        var filterInfo = this.props.filterInfo;
        var sortInfo = this.props.sortInfo;
        var actionOnRecord = this.props.actionOnRecord;
        var hiddenColumns = this.props.hiddenColumns;
        var filterClass = filterInfo.active ? 'pull-right text-right pd-r10' : 'hide';
        var sortClass = sortInfo.active ? 'pull-right text-right pd-r10' : 'hide';
        var hiddenClass = hiddenColumns.length ? 'pull-right text-right pd-r10' : 'hide';
        var infoObjClass = totalRecord == 0 ? "hide" : "pull-left text-left pd-l0 recordTotalRow";
        var sortAscClass = sortInfo.active && sortInfo.reverse ? 'fa fa-sort-alpha-desc' : 'fa fa-sort-alpha-asc';
        var totalClass = actionOnRecord.active ? 'hide' : 'col-xs-12 pd-l0';
        var selectionClass = actionOnRecord.active ? 'col-xs-12' : 'hide';

        var UpdateDocument = actionOnRecord.selectedRows.length == 1 ? <FeatureComponent.UpdateDocument actionOnRecord={actionOnRecord}/> : '';

        return (<div className="infoRow container">
                    <div className=" row">
                        <div className={infoObjClass}>
                            <div className={totalClass}>
                                <FeatureComponent.ExportasJson exportJsonData = {this.props.exportJsonData} />
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
