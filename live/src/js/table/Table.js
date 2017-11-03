import React from 'react';
import throttle from 'lodash/throttle';
/* global $, getQueryParameters */

const FeatureComponent = require('../features/FeatureComponent.js');

// This is another wrapper around the data table to implement
// pagination, throbbers, styling etc.
class Table extends React.Component {
	componentDidMount() {
		const elem = document.getElementById('exp-scrollable');
		// We are listning for scroll even so we get notified
		// when the scroll hits the bottom. For pagination.
		const throttledScroll = throttle(this.props.scrollFunction, 300);
		elem.addEventListener('scroll', throttledScroll);
	}

	componentDidUpdate() {
		// to handle new rows
		this.handleScroll();
	}

	// for keeping first column fixed
	handleScroll = () => {
		// $('thead').css('left', -$('#table-container').scrollLeft());
		$('thead th:nth-child(1)').css('left', $('#table-container').scrollLeft());
		$('.first-cell').css('left', $('#table-container').scrollLeft());
	}

	render() {
		var column_width = 250;
		var elem = document.getElementById('table-scroller');
		if (elem != null) {
			// elem.style.width = this.props.visibleColumns.length * column_width + 'px';
		}
		let maxHeight = window.innerHeight - ((getQueryParameters() && getQueryParameters().hf === 'false') ? 150 : 280);
		if (maxHeight > 780) {
			maxHeight = 780;
		}
		return (
			<div id="table-container" className={`table-container ${this.props.isLoadingData ? 'display-none' : ''}`} onScroll={this.handleScroll}>
				<div
					id="table-scroller"
					className="table-scroller"
					style={{
						maxHeight,
						overflow: 'hidden'
					}}
				>
					<table
						id="data-table"
						className="table table-fixedheader table-bordered"
					>
						<thead id="columns">
							<tr>
								{this.props.renderColumns}
							</tr>
						</thead>
						<tbody
							className="exp-scrollable"
							id="exp-scrollable"
							style={{
								maxHeight
							}}
						>
							{this.props.renderRows}
						</tbody>
					</table>
					{
						this.props.loadingSpinner &&
						<div
							className="page-loading-spinner"
							style={{
								left: $('#table-container').scrollLeft() + ((window.innerWidth - 270) / 2)
							}}
						>
							<i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw page-loading-spinner-icon" aria-hidden="true" />
						</div>
					}
					{
						this.props.selectedTypes.length && this.props.editable ?
							<div className="add-row-button">
								<FeatureComponent.AddDocument
									types={this.props.types}
									addRecord ={this.props.addRecord}
									getTypeDoc={this.props.getTypeDoc}
									userTouchAdd={this.props.userTouchAdd}
									selectClass="tags-select-small"
								/>
							</div> :
							null
					}
				</div>
			</div>
		);
	}
}

module.exports = Table;
