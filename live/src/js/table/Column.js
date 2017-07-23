const React = require("react");

import { OverlayTrigger, Popover } from "react-bootstrap";

const FilterDropdown = require("./FilterDropdown.js");

const cellWidth = "250px";

class Column extends React.Component {
	state = {
		type: null
	};

	sortingInit = () => {
		this.props.handleSort(this.props._item, this.props._type, this);
	};

	componentDidMount() {
		this.setState({
			type: this.props._type
		});
	}

	render() {
		const item = this.props._item;
		const type = this.state.type == null ? this.props._type : this.state.type;
		const sortInfo = this.props._sortInfo;
		const filterInfo = this.props.filterInfo;

		const filterClass = filterInfo.active && filterInfo.columnName == item ? "filterActive" : "";
		const extraClass = sortInfo.column == item ? `sortActive ${sortInfo.reverse}` : "";
		const fixedHead = `table-fixed-head column_width ${extraClass} ${filterClass}`;
		const filterId = `filter-${item}`;
		let datatype = null;
		let analyzed = true;
		const prettyData = " Clicking on {...} displays the JSON data. ";
		const itemText = item == "json" ?
				(<span>
					<OverlayTrigger trigger="click" rootClose placement="right" overlay={<Popover id="ab1" className="nestedJson jsonTitle">{prettyData}</Popover>}>
						<a href="javascript:void(0);" className="bracketIcon" />
					</OverlayTrigger>
					<span>&nbsp;&nbsp;type / id</span>
				</span>) :
				(<span onClick={this.sortingInit}>{item}
				</span>);
		const thtextShow = item == "json" ? "leftGap thtextShow" : "thtextShow";

		// get the datatype if field is not json & type mapping has properties field
		try {
			if (item != "json" && this.props.mappingObj[type] && this.props.mappingObj[type].hasOwnProperty("properties") && typeof this.props.mappingObj[type] !== "undefined" && typeof this.props.mappingObj[type].properties[item] !== "undefined") {
				datatype = this.props.mappingObj[type].properties[item].type;
				analyzed = this.props.mappingObj[type].properties[item].index != "not_analyzed";
			}
		}		catch (err) {
			console.log(err);
		}
		// console.log(type, item);
		// Allow sorting if item is not the first column
		// here first column is  json = type/id
		const sortIcon = (item == "json") ? <span /> : (<span className="sortIcon" onClick={this.sortingInit}>
			<i className="fa fa-chevron-up asc-icon" />
			<i className="fa fa-chevron-down desc-icon" />
		</span>);
		const filterRow = this.props.externalQueryApplied ? "" : (
			<span className="filterIcon">
				<FilterDropdown columnField={item} type={type} datatype={datatype} analyzed={analyzed} filterInfo={this.props.filterInfo} />
			</span>
		);
		// console.log(datatype, item);
		// var handleSort = this.sortingInit;

		return (<th id={item} width={cellWidth} className="tableHead">
			<div className={fixedHead}>
				<div className="headText">
					<div className={thtextShow}>
						{itemText}
					</div>
					<div className="iconList">
						{sortIcon}
						{filterRow}
					</div>
				</div>
			</div>
		</th>);
	}
}

module.exports = Column;
