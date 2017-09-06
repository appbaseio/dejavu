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
	}

	componentDidMount() {
		if (this.props.arrayOptions && this.props.item === '') {
			this.setState({
				data: [],
				prevData: []
			})
		} else if (this.props.datatype.type === 'geo_point' && this.props.item === '') {
			this.setState({
				data: {
					lat: '',
					lon: ''
				},
				prevData: {
					lat: '',
					lon: ''
				}
			});
		}
	}

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
			nextState = e.target.value;
			const isValid = nextState === '' || nextState === '-';
			if (!isNaN(nextState) || isValid) {
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
		const nextState = e.target.value;
		if (this.state.showTooltip) {
			this.setState({
				showTooltip: false
			});
		}
		const min = name === 'lat' ? -90 : -180;
		const max = name === 'lat' ? 90 : 180;
		const nextNumber = Number(nextState);
		const isValid = nextState === '' || nextState === '-';
		if (isValid || (nextNumber >= min && nextNumber <= max)) {
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
		const nextState = e.value;
		if (this.state.data !== nextState) {
			this.setState({
				data: nextState,
				active: false
			});
			this.indexCurrentData(nextState);
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
		if (nextState && (Array.isArray(this.state.data) || this.props.datatype.type === 'boolean')) {
			this.select.focus();
		}
	}

	setActive(nextState) {
		if (this.props.editable) {
			if (!nextState && this.state.data !== this.state.prevData) {
				if (this.props.datatype.type !== 'string') {
					if (this.state.data !== '-') {
						this.indexCurrentData(Number(this.state.data));
					}
				} else {
					this.indexCurrentData(this.state.data);
				}
				this.setState({
					prevData: this.state.data
				});
			}
			this.setState({
				active: nextState
			}, () => this.setSelectActive(nextState));
		}
	}

	setGeoActive(geo, nextState) {
		if (this.props.editable) {
			if (!nextState && this.state.data[geo] !== this.state.prevData[geo] && this.state.data.lat && this.state.data.lon) {
				const indexData = {};
				if (this.state.data.lat) {
					indexData.lat = Number(this.state.data.lat);
				}
				if (this.state.data.lon) {
					indexData.lon = Number(this.state.data.lon);
				}
				this.indexCurrentData(indexData);
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
		const data = this.state.data;
		// The id of the html element is generated
		// in keys.js.
		var _id = this.props._id;
		var _type = this.props._type;
		var toDisplay = data;
		var tdClass = 'column_width columnAdjust';
		if (this.props.datatype.type === 'boolean' || Array.isArray(data) || this.props.datatype.type === 'date') {
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
					<div className="row-number" style={{ display: this.state.checked ? 'none' : '' }}>
						{
							this.props.rowNumber + 1
						}
					</div>
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
			}
			if (typeof data === 'boolean') {
				toDisplay = toDisplay + '';
			}
			if (typeof data === 'string' || typeof data === 'number') {
				toDisplay = this.state.data;
			}
			if (this.props.datatype.type === 'geo_point') {
				toDisplay = (
					<div className="geo-point-container">
						<div className="geo-point-value" onClick={() => this.setGeoActive('lat', true)}>
							<ColumnLabel>Lat</ColumnLabel>
							{
								this.state.geoActive.lat ?
									<CellInput
										name="lat"
										value={this.state.data.lat}
										handleChange={this.handleGeoChange}
										handleBlur={() => this.setGeoActive('lat', false)}
										tooltipText="Latitude should be a number between -90 and +90"
										showTooltip={this.state.showTooltip}
										singleLine
									/> :
									this.state.data.lat
							}
						</div>
						<div className="geo-point-value" onClick={() => this.setGeoActive('lon', true)}>
							<ColumnLabel>Lon</ColumnLabel>
							{
								this.state.geoActive.lon ?
									<CellInput
										name="lon"
										value={this.state.data.lon}
										handleChange={this.handleGeoChange}
										handleBlur={() => this.setGeoActive('lon', false)}
										tooltipText="Longitude should be a number between -180 and +180"
										showTooltip={this.state.showTooltip}
										singleLine
									/> :
								this.state.data.lon
							}
						</div>
					</div>
				)
			}
			if (Array.isArray(data)) {
				const arrayView = this.state.data.length > 2 ?
					this.state.data.slice(0, 2).concat([{ value: '...', label: '...' }]) :
					this.state.data;
				toDisplay = (
					<Select.Creatable
						multi
						value={
							this.state.active ?
								this.state.data.map(item => ({ value: item, label: item })) :
								arrayView
						}
						options={this.props.arrayOptions.map(item => ({ value: item, label: item }))}
						disabled={!this.state.active}
						onChange={this.handleArrayChange}
						onBlur={() => this.setActive(false)}
						placeholder="Enter or select values"
						ref={(node) => { this.select = node; }}
						clearable={false}
					/>
				);
			} else if (this.props.datatype.type === 'date' && this.state.active) {
				toDisplay = (
					<Datetime
						defaultValue={moment(this.state.data, getMomentDate(this.props.datatype.format))}
						dateFormat={getMomentDate(this.props.datatype.format)}
						timeFormat={!(this.props.datatype.format === 'YYYY/MM/DD' || this.props.datatype.format === 'basic_date')}
						onBlur={(e) => {
							this.handleDatetimeChange(e);
							this.setState({ active: false });
						}}
					/>
				);
			}
		}
		return (
			<td
				id={this.props.unique}
				key={this.props.unique}
				style={style}
				className={tdClass}
				onClick={() => this.setActive(true)}
			>
				<div className={`cell-content ${Array.isArray(data) ? 'array' : this.props.datatype.type} ${this.state.active ? 'active' : ''}`}>
					<ErrorModal
						errorShow={this.state.showError}
						errorMessage={this.state.errorMessage}
						closeErrorModal={this.hideErrorMessage}
					/>
					{
						this.props.datatype.type === 'boolean' ?
							<div className="cell-input-container">
								<Select
									value={this.state.data}
									options={[{ value: true, label: 'True' }, { value: false, label: 'False' }]}
									disabled={!this.state.active}
									onChange={this.handleBooleanSelect}
									title={this.state.data.toString()}
									onSelect={this.handleBooleanSelect}
									onBlur={() => this.setActive(false)}
									placeholder="Select value"
									ref={(node) => { this.select = node; }}
									clearable={false}
								/>
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
				</div>
			</td>
		);
	}
}

Cell.propTypes = {
	_id: PropTypes.string.isRequired,
	_type: PropTypes.string.isRequired,
	columnName: PropTypes.string.isRequired,
	arrayOptions: PropTypes.arrayOf(PropTypes.string),
	rowNumber: PropTypes.number,
	editable: PropTypes.boolean,
	datatype: PropTypes.Object	// eslint-disable-line
};

Cell.defaultProps = {
	datatype: {}
};

module.exports = Cell;
