import React from 'react';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
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
import getMaxArrayView from '../helper/getMaxArrayView';

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
		showTooltip: false,
		imageLoadError: false
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
		this.populateCellData(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState({
				data: nextProps.item,
				prevData: nextProps.item
			});
		} else if (this.props.arrayOptions !== nextProps.arrayOptions) {
			this.populateCellData(nextProps);
		}
		const { _id, _type } = this.props;
		let checkFlag = false;
		if (this.props.actionOnRecord.selectedRows.length) {
			this.props.actionOnRecord.selectedRows.forEach((v) => {
				if (v._id === _id && v._type === _type) {
					checkFlag = true;
				}
			});
		} else {
			checkFlag = false;
		}
		if (this.state.checked !== checkFlag) {
			this.setState({
				checked: checkFlag
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.item !== nextProps.item ||
			this.props.visibility !== nextProps.visibility ||
			this.props._checked !== nextProps._checked ||
			this.props.actionOnRecord !== nextProps.actionOnRecord ||
			this.props.arrayOptions !== nextProps.arrayOptions ||
			this.props.rowNumber !== nextProps.rowNumber ||
			this.props.editable !== nextProps.editable ||
			this.props.isObject !== nextProps.isObject ||
			this.props.isArrayObject !== nextProps.isArrayObject ||
			this.state.checked !== nextState.checked ||
			this.state.active !== nextState.active ||
			this.state.geoActive !== nextState.geoActive ||
			this.state.showTooltip !== nextState.showTooltip ||
			this.state.data !== nextState.data ||
			this.props.datatype.type === 'geo_point' ||
			this.props.datatype !== nextProps.datatype ||
			this.props.loadImages !== nextProps.loadImages ||
			this.state.imageLoadError !== nextState.imageLoadError ||
			this.state.showError !== nextState.showError
		) {
			return true;
		}
		return false;
	}

	populateCellData(props) {
		if (props.arrayOptions && props.item === '') {
			this.setState({
				data: [],
				prevData: []
			})
		} else if (props.datatype.type === 'geo_point' && props.item === '' && !props.isObject) {
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
		} else if (props.isObject && props.item === '') {
			this.setState({
				data: {},
				prevData: {},
				active: true	// considering each object field active
			});
		}
	}

	handleChange = (e) => {
		let nextState = e.target.value;
		if (this.props.datatype.type !== 'string' && this.props.datatype.type !== 'text') {
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
		if (e.format) {
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
		if (nextState && (Array.isArray(this.state.data) || this.props.datatype.type === 'boolean' || this.props.datatype.type === 'date')) {
			this.select.focus();
		}
	}

	setActive(nextState) {
		if (this.props.editable && !this.props.isObject) {
			if (!nextState && this.state.data !== this.state.prevData) {
				if (this.props.datatype.type !== 'string' && this.props.datatype.type !== 'text') {
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
		const { _type, _id, columnName, row, _mapping } = this.props;

		const data = {
			type: _type,
			id: _id,
			body: {
				[columnName]: nextData
			}
		};

		if (_mapping && _mapping._parent && _mapping._routing && _mapping._routing.path && _mapping._routing.required) {
			data.parent = row[_mapping._routing.path];
		}

		feed.indexData(data, 'updateCell', res => this.handleErrorMsg(res));
	}

	imageOnLoad = () => {
		if (this.state.imageLoadError) {
			this.setState({
				imageLoadError: false
			});
		}
	}

	imageOnLoadError = () => {
		if (!this.state.imageLoadError) {
			this.setState({
				imageLoadError: true
			});
		}
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
		const { isObject } = this.props;
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
						<input
							onChange={this.selectRecord} className="rowSelectionCheckbox" type="checkbox" name="selectRecord"
							value={_id} data-type={_type} data-row={row} id={radioId} checked={this.state.checked}
						/>
						<label htmlFor={radioId} />
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
			if (typeof data !== 'string' && typeof data !== 'number' && typeof data !== 'boolean' && (isObject || this.props.datatype.type !== 'geo_point')) {
				var prettyData = <Pretty json={data} />;
				const objectActionOnRecord = { ...actionOnRecord };
				objectActionOnRecord.type = _type;
				objectActionOnRecord.id = _id;
				objectActionOnRecord.row = JSON.stringify(this.props.row[columnName] || (this.props.isArrayObject ? [] : {}), null, 4);
				toDisplay = (
					<div className="object-cell-container">
					{
						data ?
						Object.keys(data).length !== 0 &&
						<OverlayTrigger trigger="click" rootClose placement="left" overlay={<Popover id="ab1" className="nestedJson">
						{prettyData}
						</Popover>}>
						<a href="javascript:void(0);"  className="bracketIcon" />
						</OverlayTrigger> :
						null
					}
					{
						this.props.editable &&
						<FeatureComponent.UpdateDocument actionOnRecord={objectActionOnRecord} currentCell columnName={columnName} />
					}
					</div>
				);
			}
			if (typeof data === 'boolean' && !isObject) {
				toDisplay = toDisplay + '';
			}
			if ((typeof data === 'string' || typeof data === 'number') && !isObject) {
				toDisplay = this.state.data;
			}
			if (this.props.datatype.type === 'geo_point' && !isObject) {
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
				);
			}
			if (Array.isArray(data) && !isObject) {
				const separator = getMaxArrayView(data);
				const arrayView = this.state.data.length > separator ?
					this.state.data.slice(0, separator).map(item => ({ value: item, label: item })).concat([{ value: '...', label: '...' }]) :
					this.state.data.map(item => ({ value: item, label: item }));
				const prettyView = <Pretty json={data} />;
				const arrayEditView = (
					<div>
						<Select.Creatable
							multi
							value={
								this.state.active ?
								this.state.data.map(item => ({ value: item, label: item })) :
								arrayView
							}
							options={
								this.props.arrayOptions ?
								this.props.arrayOptions.map(item => ({ value: item, label: item }))
								.concat(this.state.data.map(item => ({ value: item, label: item }))) :
								[]
							}
							disabled={!this.state.active}
							onChange={this.handleArrayChange}
							onBlur={() => this.setActive(false)}
							placeholder="Enter or select values"
							ref={(node) => { this.select = node; }}
							clearable={false}
						/>
					</div>
				);
				toDisplay = this.state.data.length > separator ? (
					<OverlayTrigger
					trigger="click" rootClose placement="top" overlay={
						!this.props.editable ?
						<Popover id="arrayPrettyView" className="nestedJson">
						{prettyView}
						</Popover> :
						<Popover id="arrayPrettyView" bsClass="tooltip-hidden" />
					}
					>
					{arrayEditView}
					</OverlayTrigger>
				) :
				arrayEditView;
			} else if (this.props.datatype.type === 'date' && this.state.active && !isObject) {
				toDisplay = (
					<Datetime
						defaultValue={moment(this.state.data, getMomentDate(this.props.datatype.format))}
						dateFormat={
							this.props.datatype.format === 'basic_time' || this.props.datatype.format === 'basic_time_no_millis' ?
							false :
							getMomentDate(this.props.datatype.format)
						}
						timeFormat={
							!(this.props.datatype.format === 'YYYY/MM/DD' || this.props.datatype.format === 'basic_date' || this.props.datatype.format === 'date')
						}
						onBlur={(e) => {
							this.handleDatetimeChange(e);
							this.setState({ active: false });
						}}
						inputProps={{
							ref: (node) => { this.select = node; }
						}}
					/>
				);
			} else if (this.props.isImage) {
				toDisplay = (
					this.state.active ?
					(
						<div className="cell-img-container">
							<CellInput
								name={columnName}
								value={this.state.data}
								handleChange={this.handleChange}
								handleBlur={() => this.setActive(false)}
								editable={this.props.editable}
								singleLine
							/>
						</div>
					) :
					(
						<div className="cell-img-container">
							{
								this.state.data.length && this.props.loadImages ?
									<OverlayTrigger
										trigger={['hover', 'focus']} rootClose placement="top" overlay={
											<Popover id="enlarged-image-view">
												<img src={this.state.data} alt="Enlarged view" className="enlarged-image" />
											</Popover>
										}
									>
										<img src={this.state.data} alt="URL" className={`cell-img pad-right ${this.state.imageLoadError ? 'hide-img' : ''}`} onLoad={this.imageOnLoad} onError={this.imageOnLoadError} />
									</OverlayTrigger> :
								null
							}
							{
								this.state.imageLoadError && this.props.loadImages &&
								<span className="pad-right pad-left img-err-icon">
									<OverlayTrigger
										trigger={['hover', 'focus']} rootClose placement="top" overlay={
											<Tooltip id="img-load-err">
												This link does not appears to be an image
											</Tooltip>
										}
									>
										<i className="fa fa-exclamation-triangle" aria-hidden="true" />
									</OverlayTrigger>
								</span>
							}
							{this.state.data.length ? toDisplay : <span className="text-muted">Enter Image URL</span>}
						</div>
					)
				);
			}
		}
		return (
			<td
				id={this.props.unique}
				key={this.props.unique}
				style={style}
				className={`${tdClass} ${columnName === 'json' ? 'first-cell' : ''}`}
				onClick={() => this.setActive(true)}
			>
				<div className={`cell-content ${Array.isArray(data) ? 'array' : this.props.datatype.type} ${this.state.active ? 'active' : ''}`}>
					<ErrorModal
						errorShow={this.state.showError}
						errorMessage={this.state.errorMessage}
						closeErrorModal={this.hideErrorMessage}
					/>
					{
						(this.props.datatype.type === 'boolean' && !isObject) ?
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
				this.state.active && this.props.datatype.type !== 'date' && !this.props.isImage && (typeof data === 'string' || typeof data === 'number') ?
				<CellInput
					name={columnName}
					value={this.state.data}
					handleChange={this.handleChange}
					handleBlur={() => this.setActive(false)}
					showTooltip={this.state.showTooltip}
					editable={this.props.editable}
				/> :
				toDisplay.length > 37 ?
				<OverlayTrigger
				trigger="click" rootClose placement="left" overlay={
					!this.props.editable && typeof data === 'string' ?
					<Popover id="textPrettyView">
					{toDisplay}
					</Popover> :
					<Popover id="textPrettyView" bsClass="tooltip-hidden" />
				}
				>
				<span className="string-cell-span">{toDisplay}</span>
				</OverlayTrigger> :
				toDisplay
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
	editable: PropTypes.bool,
	isObject: PropTypes.bool,
	isArrayObject: PropTypes.bool,
	actionOnRecord: PropTypes.object,	// eslint-disable-line
	datatype: PropTypes.object,	// eslint-disable-line
	isImage: PropTypes.bool,
	loadImages: PropTypes.bool
};

Cell.defaultProps = {
	datatype: {}
};

module.exports = Cell;
