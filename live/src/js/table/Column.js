import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import FilterDropdown from './FilterDropdown';
import ColumnMappingInfo from './ColumnMappingInfo';

const cellWidth = '250px';

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

	getMappingPo

	getDatatype(datatype) {
		switch (datatype) {
			case 'string':
			case 'text':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<img src="src/img/string.svg" width="15px" className="column-label-img" alt="String label" />
					</ColumnMappingInfo>
				);
			case 'integer':
			case 'long':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<i className="fa fa-hashtag column-label-img" />
					</ColumnMappingInfo>
				);
			case 'geo_point':
			case 'geo_shape':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<i className="fa fa-map-marker column-label-img" />
					</ColumnMappingInfo>
				);
			case 'boolean':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<img src="src/img/boolean.svg" width="15px" className="column-label-img" alt="Boolean label" />
					</ColumnMappingInfo>
				);
			case 'date':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<i className="fa fa-calendar column-label-img" />
					</ColumnMappingInfo>
				);
			case 'float':
			case 'double':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<img src="src/img/float.svg" width="15px" className="column-label-img" alt={`${datatype} label`} />
					</ColumnMappingInfo>
				);
			case 'object':
				return (
					<ColumnMappingInfo datatype={datatype} json={this.props.mappingObj[this.props._type].properties[this.props._item]}>
						<span className="column-label-img">{'{...}'}</span>
					</ColumnMappingInfo>
				);
			default:
				return datatype;
		}
	}

	render() {
		const item = this.props._item;
		const type = this.state.type == null ? this.props._type : this.state.type;
		const sortInfo = this.props._sortInfo;
		const filterInfo = this.props.filterInfo;

		const filterClass = filterInfo.active && filterInfo.columnName == item ? 'filterActive' : '';
		const extraClass = sortInfo.column == item ? 'sortActive ' + sortInfo.reverse : '';
		const fixedHead = 'table-fixed-head column_width ' + extraClass + ' ' + filterClass;
		const filterId = 'filter-' + item;
		let datatype = null;
		let analyzed = true;
		const prettyData = " Clicking on {...} displays the JSON data. ";
		const itemText = item == 'json' ?
			(<span>
				<OverlayTrigger trigger="click" rootClose placement="right" overlay={<Popover id="ab1" className="nestedJson jsonTitle">{prettyData}</Popover>}>
					<a href="javascript:void(0);" className="bracketIcon"></a>
				</OverlayTrigger>
				<span>&nbsp;&nbsp;type / id</span>
			</span>) :
			(<span onClick={this.sortingInit}>{item}
			</span>);
		const thtextShow = item == 'json' ? 'leftGap thtextShow' : 'thtextShow';

		// get the datatype if field is not json & type mapping has properties field
		try {
			if (item != 'json' && this.props.mappingObj[type] && this.props.mappingObj[type].hasOwnProperty('properties') && typeof this.props.mappingObj[type] != 'undefined' && typeof this.props.mappingObj[type]['properties'][item] != 'undefined') {
				if (this.props.mappingObj[type]['properties'][item].type) {
					datatype = this.props.mappingObj[type]['properties'][item].type;
				} else if (this.props.mappingObj[type]['properties'][item].hasOwnProperty('properties')) {
					datatype = 'object';
				}
				analyzed = this.props.mappingObj[type]['properties'][item].index == 'not_analyzed' ? false : true;
			}
		}
		catch (err) {
			console.log(err);
		}
		// console.log(type, item);
		// Allow sorting if item is not the first column
		// here first column is  json = type/id
		const sortIcon = (item == 'json') ? <span></span> : <span className="sortIcon"  onClick={this.sortingInit}>
			<i className="fa fa-chevron-up asc-icon" />
			<i className="fa fa-chevron-down desc-icon" />
		</span>;
		const filterRow = this.props.externalQueryApplied ? '' : (
			<span className="filterIcon">
				<FilterDropdown columnField={item} type={type} datatype={datatype} analyzed={analyzed} filterInfo={this.props.filterInfo} />
			</span>
		);
		// const handleSort = this.sortingInit;

		return (
			<th id={item} width={cellWidth} className="tableHead">
				<div className={fixedHead}>
					<div className="headText">
						<div className={thtextShow}>
							{
								datatype &&
								this.getDatatype(datatype)
							}
							{itemText}
						</div>
						<div className="iconList">
							{sortIcon}
							{filterRow}
						</div>
					</div>
				</div>
			</th>
		);
	}
}

module.exports = Column;
