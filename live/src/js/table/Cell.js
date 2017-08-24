import React from 'react';
import { OverlayTrigger, Popover, DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

/* global feed, $ */

import CellInput from './CellInput';
import FeatureComponent from '../features/FeatureComponent';
import ColumnLabel from './ColumnLabel';
import ErrorModal from '../features/ErrorModal';
import getMomentDate from '../helper/getMomentDate';

const Pretty = FeatureComponent.Pretty;
// row/column manipulation functions.
// We decided to roll our own as existing
// libs with React.JS were missing critical
// features.
const cellWidth = '250px';

class Cell extends React.Component {
	static defaultProps = {
		appIdClass: "appId"
	};

	state = {
		checked: false,
		active: false,
		geoActive: {
			lat: false,
			lon: false
		},
		prevData: this.props.item,
		data: this.props.item,
		showError: false,
		errorMessage: '',
		showTooltip: false
	};

	selectRecord = (ele) => {
		var checkFlag, checkbox, _id, _type, row;
		if (this.state.checked) {
			this.setState({
				checked: false
			});
			checkbox = false;
		} else {
			this.setState({
				checked: true
			});
			checkbox = true;
		}
		_id = this.props._id;
		_type = this.props._type;
		row = this.props.row;
		this.props.actionOnRecord.selectRecord(_id, _type, row, checkFlag);
	};

	componentDidUpdate() {
		var self = this;
		var _id = this.props._id;
		var _type = this.props._type;
		var checkFlag = false;
		if (this.props.actionOnRecord.selectedRows.length) {
			this.props.actionOnRecord.selectedRows.forEach(function(v) {
				if (v._id === _id && v._type === _type)
					checkFlag = true;
			});
		} else
			checkFlag = false;
		if (this.state.checked !== checkFlag) {
			this.setState({
				checked: checkFlag
			});
		}
	}

	handleChange = (e) => {
		let nextState = e.target.value;
		if (this.props.datatype.type !== 'string') {
			if (this.state.showTooltip) {
				this.setState({
					showTooltip: false
				});
			}
			nextState = Number(e.target.value);
			if (!isNaN(nextState)) {
				this.setState({
					data: nextState
				});
			} else {
				this.setState({
					showTooltip: true
				});
			}
		} else {
			this.setState({
				data: nextState
			});
		}
	}

	handleGeoChange = (e) => {
		const { name } = e.target;
		let nextState = e.target.value;
		if (this.state.showTooltip) {
			this.setState({
				showTooltip: false
			});
		}
		if (!isNaN(nextState)) {
			nextState = Number(e.target.value);
			const { data } = this.state;
			data[name] = nextState;
			this.setState({
				data
			});
		} else {
			this.setState({
				showTooltip: true
			});
		}
	}

	handleBooleanSelect = (e) => {
		const nextState = e === '1';
		if (this.state.data !== nextState) {
			this.indexCurrentData(nextState);
			this.setState({
				data: nextState
			});
		}
	}

	handleDatetimeChange = (e) => {
		const nextState = e.format(getMomentDate(this.props.datatype.format));
		if (nextState !== this.state.prevData) {
			this.setState({
				prevData: nextState
			});
			this.indexCurrentData(nextState);
		}
		this.setState({
			data: e.format(getMomentDate(this.props.datatype.format))
		});
	}

	handleArrayChange = (e) => {
		const nextState = e.map(item => item.value);
		this.setState({
			data: nextState
		});
	}

	handleErrorMsg = (e) => {
		if (e.status >= 400) {
			this.setState({
				showError: true,
				errorMessage: e.message
			});
		}
	}

	hideErrorMessage= () => {
		this.setState({
			showError: false,
			errorMessage: ''
		});
	}

	setSelectActive(nextState) {
		if (nextState && Array.isArray(this.state.data)) {
			this.select.focus();
		}
	}

	setActive(nextState) {
		if (!nextState && this.state.data !== this.state.prevData) {
			this.indexCurrentData(this.state.data);
			this.setState({
				prevData: this.state.data
			});
		}
		this.setState({
			active: nextState
		}, () => this.setSelectActive(nextState));
	}

	setGeoActive(geo, nextState) {
		if (!nextState && this.state.data[geo] !== this.state.prevData[geo]) {
			this.indexCurrentData(this.state.data);
		}
		// update previous state of data
		this.setState({
			prevData: { ...this.state.data }
		});
		const geoActive = { ...this.state.geoActive };
		geoActive[geo] = nextState;
		this.setState({
			geoActive
		});
	}

	copyId = () => {
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(document.getElementById(this.props.unique));
		selection.removeAllRanges();
		selection.addRange(range);
		$('#copyId').val(this.props._type + '/' + this.props._id).select();
		document.execCommand('copy');
	};

	indexCurrentData(nextData) {
		feed.indexData({
			type: this.props._type,
			id: this.props._id,
			body: {
				[this.props.columnName]: nextData
			}
		}, 'updateCell', res => this.handleErrorMsg(res));
	}

	render() {
		var self = this;
		var actionOnRecord = this.props.actionOnRecord;
		var row = JSON.stringify(this.props.row);
		// exposing visibility property allows us to show / hide
		// individual cells
		var vb = this.props.visibility;
		var style = {
			display: vb
		};
		var data = this.props.item;
		// The id of the html element is generated
		// in keys.js.
		var _id = this.props._id;
		var _type = this.props._type;
		var toDisplay = data;
		var tdClass = 'column_width columnAdjust';
		if (typeof data === 'boolean' || Array.isArray(data) || this.props.datatype.type === 'date') {
			tdClass = 'column_width columnAdjust allowOverflow';
		}

		var columnName = this.props.columnName;
		var radioId = this.props.unique + 'radio';
		var appIdClass = 'appId';
		if (this.state.checked) {
			appIdClass += " showRow";
		}
		if (columnName == 'json') {
			var prettyData = <Pretty json={data} />
			toDisplay = (
				<div className={appIdClass}>
					<span className="row-number" style={{ display: this.state.checked ? 'none' : '' }}>
						{
							this.props.rowNumber + 1
						}
					</span>
					<span className="theme-element selectrow checkbox">
						<input onChange={this.selectRecord} className="rowSelectionCheckbox" type="checkbox" name="selectRecord"
							value={_id} data-type={_type} data-row={row} id={radioId} checked={this.state.checked}/>
						<label htmlFor={radioId}></label>
					</span>
					<OverlayTrigger trigger="click" rootClose placement="right" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
						<a href="javascript:void(0);" className="appId_icon bracketIcon"></a>
					</OverlayTrigger>
					<span className="appId_name" onClick={this.copyId}>
						<span className="appId_appname" title={_type}>{_type}&nbsp;/&nbsp;</span>
						<span className="appId_id" title={_id}>{_id}</span>
					</span>
				</div>
			);
			tdClass = 'column_width';
		} else {
			if (typeof data !== 'string' && typeof data !== 'number' && typeof data !== 'boolean' && this.props.datatype.type !== 'geo_point') {
				var prettyData = <Pretty json={data} />
				toDisplay = <OverlayTrigger trigger="click" rootClose placement="right" overlay={<Popover id="ab1" className="nestedJson">{prettyData}</Popover>}>
					<a href="javascript:void(0);"  className="bracketIcon">
					</a>
				</OverlayTrigger>
				// tdClass = 'column_width';
			}
			if (typeof data === 'boolean') {
				toDisplay = toDisplay + '';
			}
			if (typeof data === 'string' || typeof data === 'number') {
				toDisplay = this.state.data;
			}
			if (this.props.datatype.type === 'geo_point') {
				toDisplay = (
					<div>
						<div onClick={() => this.setGeoActive('lat', true)}>
							<ColumnLabel>Lat</ColumnLabel>
							{
								this.state.geoActive.lat ?
									<CellInput
										name="lat"
										value={this.state.data.lat}
										handleChange={this.handleGeoChange}
										handleBlur={() => this.setGeoActive('lat', false)}
										showTooltip={this.state.showTooltip}
									/> :
									this.state.data.lat
							}
						</div>
						<div className="geo-point-container" onClick={() => this.setGeoActive('lon', true)}>
							<ColumnLabel>Lon</ColumnLabel>
							{
								this.state.geoActive.lon ?
									<CellInput
										name="lon"
										value={this.state.data.lon}
										handleChange={this.handleGeoChange}
										handleBlur={() => this.setGeoActive('lon', false)}
										showTooltip={this.state.showTooltip}
									/> :
								this.state.data.lon
							}
						</div>
					</div>
				)
			}
			if (Array.isArray(data)) {
				toDisplay = (
					<Select.Creatable
						multi
						value={this.state.data.map(item => ({ value: item, label: item }))}
						options={this.props.arrayOptions.map(item => ({ value: item, label: item }))}
						disabled={!this.state.active}
						onChange={this.handleArrayChange}
						onBlur={() => this.setActive(false)}
						placeholder="Enter or select values"
						ref={(node) => { this.select = node; }}
						clearable={false}
					/>
				);
			} else if (this.props.datatype.type === 'date') {
				toDisplay = (
					<Datetime
						value={moment(this.state.data, getMomentDate(this.props.datatype.format))}
						dateFormat={getMomentDate(this.props.datatype.format)}
						timeFormat={!(this.props.datatype.format === 'YYYY/MM/DD' || this.props.datatype.format === 'basic_date')}
						onChange={this.handleDatetimeChange}
					/>
				);
			}
		}
		return (
			<td
				width={cellWidth}
				id={this.props.unique}
				key={this.props.unique}
				style={style}
				className={tdClass}
				onClick={() => this.setActive(true)}
			>
				<ErrorModal
					errorShow={this.state.showError}
					errorMessage={this.state.errorMessage}
					closeErrorModal={this.hideErrorMessage}
				/>
				{
					typeof data === 'boolean' ?
						<div className="cell-input-container">
							<DropdownButton
								title={this.state.data.toString()}
								id="datatype-boolean-dropdown"
								onSelect={this.handleBooleanSelect}
							>
								<MenuItem eventKey="1" active={this.state.data}>true</MenuItem>
								<MenuItem eventKey="2" active={!this.state.data}>false</MenuItem>
							</DropdownButton>
						</div> :
						this.state.active && this.props.datatype.type !== 'date' && (typeof data === 'string' || typeof data === 'number') ?
							<CellInput
								name={columnName}
								value={this.state.data}
								handleChange={this.handleChange}
								handleBlur={() => this.setActive(false)}
								showTooltip={this.state.showTooltip}
							/> : toDisplay
				}
			</td>
		);
	}
}

Cell.propTypes = {
	_id: PropTypes.string.isRequired,
	_type: PropTypes.string.isRequired,
	columnName: PropTypes.string.isRequired,
	arrayOptions: PropTypes.arrayOf(PropTypes.string),
	rowNumber: PropTypes.number
};

Cell.defaultProps = {
	datatype: {}
};

module.exports = Cell;
